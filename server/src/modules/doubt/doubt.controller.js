import asyncHandler from "../../utils/asyncHandler.js"
import { createDoubtService, getLessonDoubtsService, getMyDoubtsService, getCourseDoubtsService, getDoubtDetailsService, replyToDoubtService, markDoubtAnsweredService } from "./doubt.service.js"
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

export const getMyDoubts = asyncHandler(async (req, res) => {

    // Get user id from request
    const userId = req.user._id;

    // Get doubts
    const doubts = await getMyDoubtsService(userId);

    // Send response
    return res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse(MESSAGES.DOUBT.FETCHED_ALL, doubts));
});

export const getCourseDoubts = asyncHandler(async (req, res) => {

    // Get course id from request
    const courseId = req.params.id;

    // Get page and limit from req
    const { page, limit } = req.cleanQuery;

    // Get user from request
    const user = req.user;

    // Get doubts
    const doubts = await getCourseDoubtsService(courseId, user, page, limit);

    // Send response
    return res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse(MESSAGES.DOUBT.FETCHED_ALL, doubts));
});

export const getDoubtDetails = asyncHandler(async (req, res) => {

    // Get doubt id from request
    const doubtId = req.params.id;

    // Get doubt
    const { doubt, replies } = await getDoubtDetailsService(doubtId);

    // Send response
    return res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse(MESSAGES.DOUBT.FETCHED, { doubt, replies }));
});

export const replyToDoubt = asyncHandler(async (req, res) => {

    // Get message from request
    const { message } = req.body;

    // Get doubt id from request
    const doubtId = req.params.id;

    // Get user from request
    const user = req.user;

    // Create reply
    const reply = await replyToDoubtService(message, doubtId, user);

    // Send response
    return res
        .status(HTTP_STATUS.CREATED)
        .json(new ApiResponse(MESSAGES.DOUBT.REPLY_ADDED, reply));
});

export const markDoubtAnswered = asyncHandler(async (req, res) => {

    // Get doubt id from request
    const doubtId = req.params.id;

    // Get user from request
    const user = req.user;

    // Mark doubt as answered
    const doubt = await markDoubtAnsweredService(doubtId, user);

    // Send response
    return res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse(MESSAGES.DOUBT.MARKED_AS_ANSWERED, doubt));
});