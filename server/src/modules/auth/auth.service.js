import userModel from "../user/user.model.js"
import ApiError from "../../utils/apiError.js"
import { HTTP_STATUS, MESSAGES, NOTIFICATION_TYPE } from "../../constants/index.js"
import jwt from "jsonwebtoken"
import { config } from "../../config/index.js"
import { createNotificationService } from "../notification/notification.service.js"
import log from "../../utils/logger.js"


export const createUser = async (data) => {

    // Create new user
    const user = new userModel(data);

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Set hashed refresh token in db
    user.setRefreshToken(refreshToken);
    await user.save();

    // Send notification to user
    createNotificationService({
        user: user._id,
        title: "Welcome to LMS Platform",
        message: "Your account has been created successfully.",
        type: NOTIFICATION_TYPE.system
    }).catch(err => log(err, "ERROR"));

    // Return data
    return {
        newUser: {
            _id: user._id,
            name: user.name,
            email: user.email,
            bio: user.bio,
            profilePicture: user.profilePicture?.url,
            role: user.role,
        },
        accessToken,
        refreshToken
    };
};

export const loginUser = async (email, password) => {

    // Check user exists
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH.INVALID_CREDENTIALS);
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