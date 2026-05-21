import asyncHandler from "../../utils/asyncHandler.js"
import { createUser, loginUser, logoutUser, refreshAccessToken, verifyEmailService, resendOtpService } from "./auth.service.js"
import ApiResponse from "../../utils/apiResponse.js"
import { config } from "../../config/index.js"
import { HTTP_STATUS, MESSAGES } from "../../constants/index.js"


export const register = asyncHandler(async (req, res) => {

    // Get data from request
    const { name, email, password, role = "student" } = req.body;

    // Create user
    const user = await createUser({ name, email, password, role });

    // Send response
    return res
        .status(HTTP_STATUS.CREATED)
        .json(new ApiResponse(MESSAGES.AUTH.REGISTER_SUCCESS, user));
});

export const verifyEmail = asyncHandler(async (req, res) => {

    const { email, otp } = req.body;

    // Verify email
    const { userData, accessToken, refreshToken } = await verifyEmailService(email, otp);

    // Send response
    return res
        .status(HTTP_STATUS.OK)
        .cookie("accessToken", accessToken, config.cookie.ACCESS)
        .cookie("refreshToken", refreshToken, config.cookie.REFRESH)
        .json(new ApiResponse(MESSAGES.AUTH.EMAIL_VERIFIED, userData));
});

export const resendOtp = asyncHandler(async (req, res) => {

    const { email } = req.body;

    // Resend otp
    await resendOtpService(email);

    // Send response
    return res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse(MESSAGES.AUTH.OTP_RESENT));
});

export const login = asyncHandler(async (req, res) => {

    // Get data from request
    const { email, password } = req.body;

    // Authenticate user
    const { user, accessToken, refreshToken } = await loginUser(email, password);

    // Send response
    return res
        .status(HTTP_STATUS.OK)
        .cookie("accessToken", accessToken, config.cookie.ACCESS)
        .cookie("refreshToken", refreshToken, config.cookie.REFRESH)
        .json(new ApiResponse(MESSAGES.AUTH.LOGIN_SUCCESS, user));
});

export const logout = asyncHandler(async (req, res) => {

    // Get user from request
    const user = req.user;

    // Logout user
    await logoutUser(user._id);

    // Send response
    return res
        .status(HTTP_STATUS.OK)
        .clearCookie("accessToken", config.cookie.ACCESS)
        .clearCookie("refreshToken", config.cookie.REFRESH)
        .json(new ApiResponse(MESSAGES.AUTH.LOGOUT_SUCCESS));
});

export const refresh = asyncHandler(async (req, res) => {

    // Get token from cookie
    const token = req?.cookies?.refreshToken;

    // Refresh token
    const { accessToken, refreshToken } = await refreshAccessToken(token);

    // Send response
    return res
        .status(HTTP_STATUS.OK)
        .cookie("accessToken", accessToken, config.cookie.ACCESS)
        .cookie("refreshToken", refreshToken, config.cookie.REFRESH)
        .json(new ApiResponse(MESSAGES.AUTH.TOKEN_REFRESHED));
});