import asyncHandler from "../../utils/asyncHandler.js"
import { createUser, loginUser, logoutUser } from "./auth.service.js"
import ApiResponse from "../../utils/apiResponse.js"
import { config } from "../../config/index.js"
import { HTTP_STATUS, MESSAGES } from "../../constants/index.js"

export const register = asyncHandler(async (req, res) => {

    // Get data from request
    const { name, email, password, role = "student" } = req.body;

    // Create user
    const { newUser, accessToken, refreshToken } = await createUser({ name, email, password, role });

    // Send response
    return res
        .status(HTTP_STATUS.CREATED)
        .cookie("accessToken", accessToken, config.cookie.ACCESS)
        .cookie("refreshToken", refreshToken, config.cookie.REFRESH)
        .json(new ApiResponse(MESSAGES.AUTH.REGISTER_SUCCESS, newUser));
});

export const login = asyncHandler(async (req, res) => {

    // Get data from request
    const { email, password } = req.body;

    // Authenticate user
    const { user, accessToken, refreshToken } = await loginUser({ email, password });

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