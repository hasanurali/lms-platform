import lessonModel from "./lesson.model.js"
import moduleModel from "../module/module.model.js";
import enrollmentModel from "../enrollment/enrollment.model.js"
import ApiError from "../../utils/apiError.js";
import { HTTP_STATUS, MESSAGES } from "../../constants/index.js";
import validateObjectId from "../../utils/validateObjectId.js";


// Get instructor population
const getInstructorPopulation = {
    path: "module",
    populate: {
        path: "course",
        select: "instructor"
    }
}

export const createLessonService = async (title, videoUrl, content, moduleId, instructorId) => {

    // Check valid id
    validateObjectId(moduleId);

    // Fetch module by id
    const module = await moduleModel.findById(moduleId).populate({
        path: "course",
        select: "instructor"
    });

    if (!module) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.MODULE.NOT_FOUND);
    };

    // Check instructor is owned this module
    if (instructorId.toString() !== module.course.instructor.toString()) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.LESSON.UNAUTHORIZED);
    };

    // Check lesson order
    const lastLesson = await lessonModel.findOne({ module: moduleId }).sort({ order: -1 });

    // Set lesson order
    const order = lastLesson ? lastLesson.order + 1 : 1;

    // Create new lesson
    let lesson = await lessonModel.create({
        module: moduleId,
        title,
        videoUrl,
        content,
        order
    });

    // Return data
    return lesson;
};

export const getLessonsService = async (moduleId) => {

    // Check valid id
    validateObjectId(moduleId);

    // Check module exist by id
    const isModule = await moduleModel.exists({ _id: moduleId });
    if (!isModule) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.MODULE.NOT_FOUND);
    };

    // Fetch lessons
    const lessons = await lessonModel.find({ module: moduleId }).sort({ order: 1 });

    // Return data
    return lessons;
};

export const getLessonService = async (userId, lessonId) => {

    // Check valid id
    validateObjectId(lessonId);

    // Fetch lesson by id
    const lesson = await lessonModel.findById(lessonId);
    if (!lesson) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.LESSON.NOT_FOUND);
    };

    // Check user enrolled in this course
    const module = await moduleModel.findById(lesson.module);
    const isEnrolled = await enrollmentModel.exists({ user: userId, course: module.course });
    if (!isEnrolled) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.ENROLLMENT.REQUIRED)
    }

    // Return data
    return lesson;
};

export const updateLessonService = async (data, lessonId, instructorId) => {

    // Check valid id
    validateObjectId(lessonId);

    // Check lesson exist by id
    const lesson = await lessonModel.findById(lessonId).populate(getInstructorPopulation);
    if (!lesson) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.LESSON.NOT_FOUND);
    };

    // Check instructor is owned this lesson
    if (instructorId.toString() !== lesson.module.course.instructor.toString()) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.LESSON.UNAUTHORIZED);
    };

    // Update lesson
    const updatedLesson = await lessonModel.findByIdAndUpdate(lessonId, data, { returnDocument: "after" });

    // Return data
    return updatedLesson;
};

export const deleteLessonService = async (lessonId, instructorId) => {

    // Check valid id
    validateObjectId(lessonId);

    // Check lesson exist by id
    const lesson = await lessonModel.findById(lessonId).populate(getInstructorPopulation);
    if (!lesson) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.LESSON.NOT_FOUND);
    };

    // Check instructor is owned this lesson
    if (instructorId.toString() !== lesson.module.course.instructor.toString()) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.LESSON.UNAUTHORIZED);
    };

    // Delete lesson
    await lessonModel.deleteOne({ _id: lessonId });
};