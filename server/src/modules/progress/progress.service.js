import courseModel from "../course/course.model.js";
import moduleModel from "../module/module.model.js";
import progressModel from "./progress.model.js"
import lessonModel from "../lesson/lesson.model.js";
import ApiError from "../../utils/apiError.js";
import { HTTP_STATUS, MESSAGES } from "../../constants/index.js";
import validateObjectId from "../../utils/validateObjectId.js";


export const getProgressService = async (courseId, userId) => {

    // Validate ID
    validateObjectId(courseId);

    // Check course exists
    const course = await courseModel.exists({ _id: courseId });
    if (!course) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.COURSE.NOT_FOUND);
    }

    // Get modules
    const modules = await moduleModel.find({ course: courseId }).select("_id");
    const moduleIds = modules.map(m => m._id);

    // Get progress
    const progress = await progressModel.findOne({ user: userId, course: courseId });

    // Count total lessons
    const totalLessons = await lessonModel.countDocuments({
        module: { $in: moduleIds }
    });

    // If no progress return default
    if (!progress) {
        return {
            progress: {
                completedLessons: [],
                lastAccessLesson: null,
                completed: false
            },
            progressPercentage: 0
        };
    }

    // Calculate percentage
    const progressPercentage = totalLessons === 0 ? 0 : Math.round((progress.completedLessons.length / totalLessons) * 100);

    // Return data
    return {
        progress,
        progressPercentage
    };
};

export const completeLessonService = async ({ courseId, lessonId, userId }) => {

    // Validate ids
    validateObjectId(courseId);
    validateObjectId(lessonId);

    // Check course exists
    const course = await courseModel.exists({ _id: courseId });
    if (!course) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.COURSE.NOT_FOUND);
    }

    // Check if course already completed
    let progress = await progressModel.findOne({ user: userId, course: courseId });

    // If course completed return data
    if (progress?.completed) {
        return progress;
    };

    // Get modules
    const modules = await moduleModel.find({ course: courseId }).select("_id");
    const moduleIds = modules.map(m => m._id);

    // Count total lessons
    const totalLessons = await lessonModel.countDocuments({ module: { $in: moduleIds } });

    // Check lesson belong to this course
    const isValidLesson = await lessonModel.exists({ _id: lessonId, module: { $in: moduleIds } });
    if (!isValidLesson) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.GENERAL.VALIDATION_ERROR)
    };

    // Update progress
    progress = await progressModel.findOneAndUpdate(
        { user: userId, course: courseId },
        {
            $addToSet: { completedLessons: lessonId },
            $set: { lastAccessLesson: lessonId }
        },
        { upsert: true, new: true }
    );

    // Mark complete if finished
    const isComplete = totalLessons > 0 && progress.completedLessons.length === totalLessons;
    if (isComplete && !progress.completed) {
        progress.completed = true;
        await progress.save();
    }

    // Return data
    return progress;
};

export const setLastAccessedLessonService = async ({ courseId, lessonId, userId }) => {

    // Validate ids
    validateObjectId(courseId);
    validateObjectId(lessonId);

    // Check course exists
    const course = await courseModel.exists({ _id: courseId });
    if (!course) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.COURSE.NOT_FOUND);
    }

    // Get modules
    const modules = await moduleModel.find({ course: courseId }).select("_id");
    const moduleIds = modules.map(m => m._id);

    // Check lesson belong to this course
    const isValidLesson = await lessonModel.exists({ _id: lessonId, module: { $in: moduleIds } });
    if (!isValidLesson) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.GENERAL.VALIDATION_ERROR)
    };

    // Update last lesson
    let progress = await progressModel.findOneAndUpdate(
        { user: userId, course: courseId },
        {
            $set: { lastAccessLesson: lessonId }
        },
        { upsert: true, new: true }
    );

    // Return data
    return progress;
};