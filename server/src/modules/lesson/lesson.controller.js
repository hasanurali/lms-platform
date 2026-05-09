import asyncHandler from "../../utils/asyncHandler.js"
import { createLessonService, getLessonsService, getLessonService, updateLessonService, deleteLessonService } from "./lesson.service.js"
import ApiResponse from "../../utils/apiResponse.js"
import { HTTP_STATUS, MESSAGES } from "../../constants/index.js"

export const createLesson = asyncHandler(async (req, res) => {

    // Get data from request
    const { title, content } = req.body;

    // Get video data from request by multer
    const videoFile = req.file;

    // Get module id from request
    const moduleId = req.params.id;

    // Get instructor id from request
    const instructorId = req.user._id;

    // Create lesson
    const lesson = await createLessonService(title, videoFile, content, moduleId, instructorId);

    // Send response
    return res
        .status(HTTP_STATUS.CREATED)
        .json(new ApiResponse(MESSAGES.LESSON.CREATED, lesson));
});

export const getLessons = asyncHandler(async (req, res) => {

    // Get module id from request
    const moduleId = req.params.id;

    // Get lessons
    const lessons = await getLessonsService(moduleId);

    // Send response
    return res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse(MESSAGES.LESSON.FETCHED_ALL, lessons));
});

export const getLesson = asyncHandler(async (req, res) => {

    // Get lesson id from req
    const lessonId = req.params.id;

    // Get user from request
    const user = req.user._id

    // Get lesson
    const lesson = await getLessonService(user, lessonId);

    // Send response
    return res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse(MESSAGES.LESSON.FETCHED, lesson));
});

export const updatelesson = asyncHandler(async (req, res) => {


    // Get data from request
    const { title, content } = req.body;

    // Get video data from request by multer
    const videoFile = req.file;

    // Get lesson id from request
    const lessonId = req.params.id;

    // Get instructor id from request
    const instructorId = req.user._id;

    // Check is valid data
    const data = {};
    if (title !== undefined) data.title = title;
    if (videoFile !== undefined) data.videoFile = videoFile;
    if (content !== undefined) data.content = content;

    // Update lesson
    const lesson = await updateLessonService(data, lessonId, instructorId);

    // Send response
    return res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse(MESSAGES.LESSON.UPDATED, lesson));
});

export const deleteLesson = asyncHandler(async (req, res) => {

    // Get lesson id from request
    const lessonId = req.params.id;

    // Get instructor id from request
    const instructorId = req.user._id;

    // delete lesson
    await deleteLessonService(lessonId, instructorId);

    // Send response
    return res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse(MESSAGES.LESSON.DELETED));
});