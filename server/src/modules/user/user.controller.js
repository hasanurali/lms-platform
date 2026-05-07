import asyncHandler from "../../utils/asyncHandler.js"
import { getUsersService } from "./user.service.js"
import ApiResponse from "../../utils/apiResponse.js"
import { HTTP_STATUS, MESSAGES } from "../../constants/index.js"

export const me = asyncHandler(async (req, res) => {

    // Get user from req
    const user = req.user;

    // Send response
    return res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse(MESSAGES.USER.FETCHED, user));
});

export const getUsers = asyncHandler(async (req, res) => {

    // Get users
    const users = await getUsersService();

    // Send response
    return res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse(MESSAGES.USER.FETCHED_ALL, users));
});
