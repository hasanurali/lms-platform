import lessonModel from "./lesson.model.js"
import moduleModel from "../module/module.model.js";
import ApiError from "../../utils/apiError.js";
import { HTTP_STATUS, MESSAGES } from "../../constants/index.js";
import validateObjectId from "../../utils/validateObjectId.js";


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

export const getLessonService = async (lessonId) => {

    // Check valid id
    validateObjectId(lessonId);

    // Fetch lesson by id
    const lesson = await lessonModel.findById(lessonId);
    if (!lesson) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.LESSON.NOT_FOUND);
    };

    // Return data
    return lesson;
};