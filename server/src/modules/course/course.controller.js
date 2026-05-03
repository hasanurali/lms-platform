import asyncHandler from "../../utils/asyncHandler.js"
import { createCourseService, getCoursesService, getCourseService } from "./course.service.js"
import ApiResponse from "../../utils/apiResponse.js"
import { HTTP_STATUS, MESSAGES } from "../../constants/index.js"

export const createCourse = asyncHandler(async (req, res) => {

    //Get data from request
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
    const coursesData = await getCoursesService({ page, limit });

    // Send response
    return res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse(MESSAGES.COURSE.FETCHED_ALL, coursesData));
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