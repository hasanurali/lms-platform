import userModel from "../user/user.model.js"
import ApiError from "../../utils/apiError.js"
import { HTTP_STATUS, MESSAGES, NOTIFICATION_TYPE } from "../../constants/index.js"
import jwt from "jsonwebtoken"
import { config } from "../../config/index.js"
import { createNotificationService } from "../notification/notification.service.js"
import log from "../../utils/logger.js"
import { generateOtp, getOtpHtml } from "../../utils/otpGenerator.js"
import otpModel from "./otp.model.js"
import crypto from "crypto";
import sendEmail from "../../utils/sendEmail.js"


export const createUser = async (data) => {

    // Create new user
    const user = await userModel.create(data);

    // Generate otp and otp ui template
    const otp = generateOtp();
    const html = getOtpHtml(otp);
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    // Parallelize OTP save and email send
    await Promise.all([
        otpModel.create({ email: user.email, user: user._id, otp: otpHash }),
        sendEmail(user.email, "OTP Verification", `Your OTP is: ${otp}`, html)
    ]);

    // Return data
    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture?.url,
        role: user.role,
        isVerified: user.isVerified
    }
};

export const verifyEmailService = async (email, otp) => {

    // Check email provided
    if (!email) {
        throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, MESSAGES.GENERAL.SOMETHING_WENT_WRONG);
    };

    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

    // Check user otp is valid
    const otpRecord = await otpModel.findOne({ email, otp: otpHash })
    if (!otpRecord) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.AUTH.INVALID_OTP);
    };

    // parallelize fetch user and delete otp
    const [user] = await Promise.all([
        userModel.findByIdAndUpdate(otpRecord.user, { isVerified: true }, { returnDocument: "after" })
            .select("_id name email bio profilePicture role isVerified"),
        otpModel.findByIdAndDelete(otpRecord._id)
    ]);

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Send notification to user
    createNotificationService({
        user: user._id,
        title: "Welcome to LMS Platform",
        message: "Your account has been created successfully.",
        type: NOTIFICATION_TYPE.system
    }).catch(err => log(err, "ERROR"));

    // Return data
    return {
        userData: {
            _id: user._id,
            name: user.name,
            email: user.email,
            bio: user.bio,
            profilePicture: user.profilePicture?.url,
            role: user.role,
            isVerified: user.isVerified
        },
        accessToken,
        refreshToken
    }
};

export const loginUser = async (email, password) => {

    // Check user exists
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH.INVALID_CREDENTIALS);
    };

    if (!user.isVerified) {

        // Generate otp and otp ui template
        const otp = generateOtp();
        const html = getOtpHtml(otp);
        const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

        // Delete user releted all otp
        await otpModel.deleteOne({ email: user.email });

        // Parallelize OTP save and email send
        await Promise.all([
            otpModel.create({ email: user.email, user: user._id, otp: otpHash }),
            sendEmail(user.email, "OTP Verification", `Your OTP is: ${otp}`, html)
        ]);

        // Throw error with email
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH.EMAIL_NOT_VERIFY, [{ email: user.email }]);
    };

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    // Generate token
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Set hashed refresh token in db
    userModel.findByIdAndUpdate(user._id, {
        refreshToken: user.hashToken(refreshToken)
    }).exec();

    // Return data
    return {
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            bio: user.bio,
            profilePicture: user.profilePicture?.url,
            role: user.role,
            isVerified: user.isVerified
        },
        accessToken,
        refreshToken
    };
};

export const logoutUser = async (userId) => {

    // Find user and update refresh token to null
    await userModel.findByIdAndUpdate(userId, {
        refreshToken: null,
    });
};

export const refreshAccessToken = async (token) => {

    // Check token is provided
    if (!token) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH.TOKEN_EXPIRED);
    };

    // Decode token by using jwt
    let decoded;
    try {
        decoded = jwt.verify(token, config.jwt.REFRESH.SECRET);
    } catch (err) {

        if (err.name === "TokenExpiredError") {
            throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH.TOKEN_EXPIRED);
        };

        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED);

    };

    // Check user exist
    const user = await userModel.findById(decoded.id).select("+refreshToken");
    if (!user || !user.refreshToken) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED);
    };

    // Verify token 
    const isValid = user.compareRefreshToken(token);
    if (!isValid) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED);
    };

    // Generate token
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Set hashed refresh token in db
    userModel.findByIdAndUpdate(user._id, {
        refreshToken: user.hashToken(refreshToken)
    }).exec();

    // Return data
    return { accessToken, refreshToken };
};