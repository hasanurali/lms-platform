import asyncHandler from "../../utils/asyncHandler.js"
import { createCourseService, getCoursesService, getFullCourseService, getCourseService, updateCourseService, deleteCourseService } from "./course.service.js"
import ApiResponse from "../../utils/apiResponse.js"
import { HTTP_STATUS, MESSAGES } from "../../constants/index.js"

export const createCourse = asyncHandler(async (req, res) => {

    // Get data from request
    const { title, description, price, thumbnail } = req.body;

    // Get instructor id from request
    const instructorId = req.user._id;

    // Create course
    const course = await createCourseService({ title, description, instructor: instructorId, price, thumbnail });

    // Send response
    return res
        .status(HTTP_STATUS.CREATED)
        .json(new ApiResponse(MESSAGES.COURSE.CREATED, course));
});

export const getCourses = asyncHandler(async (req, res) => {

    // Get page and limit from req
    const { page, limit } = req.query;

    // Get courses data
    const coursesData = await getCoursesService(page, limit);

    // Send response
    return res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse(MESSAGES.COURSE.FETCHED_ALL, coursesData));
});

export const getFullCourse = asyncHandler(async (req, res) => {

    // Get course id from req
    const courseId = req.params.id;

    const userId = req?.user?._id;

    // Get full detailed course
    const detailedCourse = await getFullCourseService(courseId, userId);

    // Send response
    return res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse(MESSAGES.COURSE.FETCHED, detailedCourse));
});

export const getCourse = asyncHandler(async (req, res) => {

    // Get course id from req
    const courseId = req.params.id;

    // Get course
    const course = await getCourseService(courseId);

    // Send response
    return res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse(MESSAGES.COURSE.FETCHED, course));
});

export const updateCourse = asyncHandler(async (req, res) => {


    // Get data from request
    const { title, description, price, thumbnail, isPublished } = req.body;

    // Get course id from request
    const courseId = req.params.id;

    // Get instructor id from request
    const instructorId = req.user._id;

    // Check is valid data
    const data = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = price;
    if (thumbnail !== undefined) data.thumbnail = thumbnail;
    if (isPublished !== undefined) data.isPublished = isPublished;

    // Update course
    const course = await updateCourseService(data, instructorId, courseId);

    // Check is published 
    if (course.isPublished) {

        // Send response
        return res
            .status(HTTP_STATUS.OK)
            .json(new ApiResponse(MESSAGES.COURSE.PUBLISHED, course));

    };

    // Send response
    return res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse(MESSAGES.COURSE.UPDATED, course));
});

export const deleteCourse = asyncHandler(async (req, res) => {

    // Get course id from request
    const courseId = req.params.id;

    // Get instructor id from request
    const instructorId = req.user._id;

    // delete course
    await deleteCourseService(instructorId, courseId);

    // Send response
    return res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse(MESSAGES.COURSE.DELETED));
});