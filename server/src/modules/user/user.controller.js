import asyncHandler from "../../utils/asyncHandler.js"
import ApiResponse from "../../utils/apiResponse.js"
import { HTTP_STATUS } from "../../constants/index.js"

export const me = asyncHandler(async (req, res) => {

    // Get user from req
    const user = req.user;

    // Send response
    return res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse("User fetched successfully", user));
});
