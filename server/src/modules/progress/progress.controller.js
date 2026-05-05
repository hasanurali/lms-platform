import asyncHandler from "../../utils/asyncHandler.js"
import { getProgressService } from "./progress.service.js"
import ApiResponse from "../../utils/apiResponse.js"
import { HTTP_STATUS, MESSAGES } from "../../constants/index.js"

export const getProgress = asyncHandler(async (req, res) => {

    // Get course id from request
    const courseId = req.params.courseId;

    // Get user id from request
    const userId = req.user._id;

    // Get progress
    const progress = await getProgressService(courseId, userId);

    // Send response
    return res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse(MESSAGES.PROGRESS.FETCHED, progress));
});