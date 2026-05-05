import asyncHandler from "../../utils/asyncHandler.js"
import { getProgressService, completeLessonService } from "./progress.service.js"
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

export const completeLesson = asyncHandler(async (req, res) => {

    // Get course and lesson id form request
    const { course, lesson } = req.body

    // Get user id from request
    const userId = req.user._id;

    // Add lesson in progress
    const progress = await completeLessonService({ courseId: course, lessonId: lesson, userId });

    // Check course is complete
    if (progress.completed) {

        // Send response
        return res
            .status(HTTP_STATUS.OK)
            .json(new ApiResponse(MESSAGES.PROGRESS.COMPLETED, progress));
    };

    // Send response
    return res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse(MESSAGES.PROGRESS.UPDATED, progress));
});