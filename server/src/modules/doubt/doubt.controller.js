import asyncHandler from "../../utils/asyncHandler.js"
import { createDoubtService, getLessonDoubtsService } from "./doubt.service.js"
import ApiResponse from "../../utils/apiResponse.js"
import { HTTP_STATUS, MESSAGES } from "../../constants/index.js"

export const createDoubt = asyncHandler(async (req, res) => {

    // Get data from request
    const { course, lesson, title, description } = req.body;

    // Get user from request
    const user = req.user;

    // Create doubt
    const { doubt, reply } = await createDoubtService(course, lesson, title, description, user);

    // Send response
    return res
        .status(HTTP_STATUS.CREATED)
        .json(new ApiResponse(MESSAGES.DOUBT.CREATED, { doubt, reply }));
});


export const getLessonDoubts = asyncHandler(async (req, res) => {

    // Get lesson id from request
    const lessonId = req.params.id;

    // Get doubts
    const doubts = await getLessonDoubtsService(lessonId);

    // Send response
    return res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse(MESSAGES.DOUBT.FETCHED_ALL, doubts));
});