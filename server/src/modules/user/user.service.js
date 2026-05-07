import userModel from "./user.model.js";
import ApiError from "../../utils/apiError.js";
import { HTTP_STATUS, MESSAGES } from "../../constants/index.js";
import validateObjectId from "../../utils/validateObjectId.js"

export const getUsersService = async () => {

    // Fetch all users except admin
    const users = await userModel.find({ role: { $not: { $eq: "admin" } } });

    // Return data
    return users;
};

export const getUserService = async (userId) => {

    // Check valid id
    validateObjectId(userId);

    // Fetch user by id
    const user = await userModel.findById(userId);
    if (!user) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.USER.NOT_FOUND)
    };

    // Return data
    return user;
};

export const updateProfileService = async (userId, data) => {

    // Update profile by user id
    const user = await userModel.findByIdAndUpdate(userId, data, { returnDocument: "after" });

    // Return data
    return user;
};