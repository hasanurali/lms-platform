import asyncHandler from "../../utils/asyncHandler.js"
import { createReviewService, getReviewsService, updateReviewService } from "./review.service.js"
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

export const getReviews = asyncHandler(async (req, res) => {

    // Get page and limit from request
    const { page, limit } = req.cleanQuery;

    // Get course id from request
    const courseId = req.params.id;

    // Get reviews with pagination
    const reviews = await getReviewsService(courseId, page, limit);

    // Send response
    return res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse(MESSAGES.REVIEW.FETCHED_ALL, reviews));
});

export const updateReview = asyncHandler(async (req, res) => {

    // Get data from request
    const { rating, message } = req.body;

    // Get review id from request
    const reviewId = req.params.id;

    // Get student id from request
    const studentId = req.user._id

    // Check valid data
    const data = {};
    if (rating) data.rating = rating;
    if (message) data.message = message;

    // Update review
    const review = await updateReviewService(data, reviewId, studentId);

    // Send response
    return res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse(MESSAGES.REVIEW.UPDATED, review));
});