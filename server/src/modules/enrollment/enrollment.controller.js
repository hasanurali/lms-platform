import asyncHandler from "../../utils/asyncHandler.js"
import { createEnrollmentService } from "./enrollment.service.js"
import ApiResponse from "../../utils/apiResponse.js"
import { HTTP_STATUS, MESSAGES } from "../../constants/index.js"

export const createEnrollment = asyncHandler(async (req, res) => {

    // Get course id from request
    const courseId = req.params.id;

    // Get user id from request
    const userId = req.user._id;

    // Enroll in the course
    const enrollmentCourse = await createEnrollmentService(courseId, userId);

    // Send response
    return res
        .status(HTTP_STATUS.CREATED)
        .json(new ApiResponse(MESSAGES.ENROLLMENT.ENROLL_SUCCESS, enrollmentCourse));
});