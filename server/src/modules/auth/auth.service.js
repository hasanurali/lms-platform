import userModel from "../user/user.model.js"
import ApiError from "../../utils/apiError.js"
import { HTTP_STATUS, MESSAGES } from "../../constants/index.js"

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