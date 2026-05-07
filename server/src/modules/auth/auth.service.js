import userModel from "../user/user.model.js"
import ApiError from "../../utils/apiError.js"
import { HTTP_STATUS, MESSAGES } from "../../constants/index.js"
import jwt from "jsonwebtoken"
import { config } from "../../config/index.js"


export const createUser = async (data) => {

    // Check user exists
    const isUserExist = await userModel.exists({ email: data.email });
    if (isUserExist) {
        throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.AUTH.EMAIL_EXISTS);
    };

    // Create new user
    const user = await userModel.create(data);

    // Generate token
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Set hashed refresh token in db
    await user.setRefreshToken(refreshToken);
    await user.save();

    // Return data
    return {
        newUser: user,
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
    await user.setRefreshToken(refreshToken);
    await user.save();

    // Return data
    return {
        user,
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
    const isValid = await user.compareRefreshToken(token);
    if (!isValid) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED);
    };

    // Generate token
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Set hashed refresh token in db
    await user.setRefreshToken(refreshToken);
    await user.save();

    // Return data
    return {
        accessToken,
        refreshToken
    };
};