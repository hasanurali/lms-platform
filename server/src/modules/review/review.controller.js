import asyncHandler from "../../utils/asyncHandler.js"
import { createReviewService } from "./review.service.js"
import ApiResponse from "../../utils/apiResponse.js"
import { HTTP_STATUS, MESSAGES } from "../../constants/index.js"

export const createReview = asyncHandler(async (req, res) => {

    // Get data from request
    const { rating, message } = req.body;

    // Get course id from request
    const courseId = req.params.id;

    // Get student id from request
    const studentId = req.user._id;

    // Create review
    const review = await createReviewService(rating, message, courseId, studentId);

    // Send response
    return res
        .status(HTTP_STATUS.CREATED)
        .json(new ApiResponse(MESSAGES.REVIEW.CREATED, review));
});