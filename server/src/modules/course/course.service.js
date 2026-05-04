import courseModel from "./course.model.js"
import ApiError from "../../utils/apiError.js";
import { HTTP_STATUS, MESSAGES } from "../../constants/index.js";
import mongoose from "mongoose";
import validateObjectId from "../../utils/validateObjectId.js";


// Common population for instructor
const commonPopulate = {
    path: "instructor",
    select: "name email"
};

export const createCourseService = async (data) => {

    // Create course
    const course = await courseModel.create(data);

    // Get populated instructor data with course
    const populatedData = await courseModel.findById(course._id).populate(commonPopulate)

    // Return data
    return populatedData;
};

export const getCoursesService = async ({ page = 1, limit = 10 }) => {

    // Calculate page and limit
    const safePage = Math.max(parseInt(page) || 1, 1);
    const safeLimit = Math.min(Math.max(parseInt(limit) || 10, 1), 50);

    // Calculate skip
    const skip = (safePage - 1) * safeLimit;

    // Fetch courses
    const courses = await courseModel.find({ isPublished: true })
        .skip(skip)
        .limit(safeLimit)
        .sort({ createdAt: -1 })
        .populate(commonPopulate);

    // Total count for pagination
    const total = await courseModel.countDocuments({ isPublished: true });

    // Return data
    return {
        data: courses,
        pagination: {
            total,
            page: safePage,
            limit: safeLimit,
            pages: Math.ceil(total / safeLimit),
            hasNext: safePage * safeLimit < total,
            hasPrev: safePage > 1,
        }
    };
};

export const getCourseService = async (courseId) => {

    // Check valid id
    validateObjectId(courseId);

    // Fetch course by id
    const course = await courseModel.findById(courseId).populate(commonPopulate);
    if (!course) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.COURSE.NOT_FOUND);
    };

    // Return data
    return course;
};

export const updateCourseService = async ({ data, instructorId, courseId }) => {

    // Check valid id
    validateObjectId(courseId);

    // Fetch course by id
    const course = await courseModel.findById(courseId);
    if (!course) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.COURSE.NOT_FOUND);
    };

    // Check instructor is owned this course
    if (instructorId.toString() !== course.instructor.toString()) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.COURSE.UNAUTHORIZED);
    };

    // Update course
    const updatedCourse = await courseModel.findByIdAndUpdate(courseId, data, { returnDocument: "after" })
        .populate(commonPopulate);

    // Return data
    return updatedCourse;
};

export const deleteCourseService = async ({ instructorId, courseId }) => {

    // Check valid id
    validateObjectId(courseId);

    // Fetch course by id
    const course = await courseModel.findById(courseId);
    if (!course) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.COURSE.NOT_FOUND);
    };

    // Check instructor is owned this course
    if (instructorId.toString() !== course.instructor.toString()) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.COURSE.UNAUTHORIZED);
    };

    // Delete course
    await courseModel.findByIdAndDelete(courseId);
};