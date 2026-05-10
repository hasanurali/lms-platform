import asyncHandler from "../../utils/asyncHandler.js"
import { getUsersService, getUserService, updateProfileService } from "./user.service.js"
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

export const getUser = asyncHandler(async (req, res) => {

    // Get user id from request
    const userId = req.params.id;

    // Get specific user by id
    const user = await getUserService(userId);

    // Send response
    return res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse(MESSAGES.USER.FETCHED, user));
});

export const updateProfile = asyncHandler(async (req, res) => {

    // Get data from request
    const { name, bio } = req.body;

    // Get image data from request by multer
    const imageFile = req.file;

    // Get current user id from request
    const userId = req.user._id;

    // Check is valid data
    const data = {};
    if (name) data.name = name;
    if (imageFile) data.imageFile = imageFile;
    if (bio) data.bio = bio;

    // Get updated user
    const updatedUser = await updateProfileService(userId, data);

    // Send response
    return res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse(MESSAGES.USER.UPDATE, updatedUser));
});