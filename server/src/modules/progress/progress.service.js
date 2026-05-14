import courseModel from "../course/course.model.js";
import moduleModel from "../module/module.model.js";
import progressModel from "./progress.model.js"
import lessonModel from "../lesson/lesson.model.js";
import enrollmentModel from "../enrollment/enrollment.model.js";
import ApiError from "../../utils/apiError.js";
import { HTTP_STATUS, MESSAGES } from "../../constants/index.js";
import validateObjectId from "../../utils/validateObjectId.js";


export const getProgressService = async (courseId, userId) => {

    // Validate ID
    validateObjectId(courseId);


    // Parallelize course and enrollment existance check
    const [course, enrolled] = await Promise.all([
        courseModel.exists({ _id: courseId }),
        enrollmentModel.exists({ user: userId, course: courseId })
    ]);

    // Check course exists
    if (!course) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.COURSE.NOT_FOUND);
    };

    // Check user enrolled in this course
    if (!enrolled) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.ENROLLMENT.REQUIRED)
    };

    const [moduleIds, progress] = await Promise.all([
        moduleModel.distinct("_id", { course: courseId }),
        progressModel.findOne({ user: userId, course: courseId })
            .select("_id course user completedLessons completed lastAccessLesson")
            .lean()
    ]);

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

    // Parallelize course and enrollment existance check
    const [course, enroll] = await Promise.all([
        courseModel.exists({ _id: courseId }),
        enrollmentModel.exists({ user: userId, course: courseId })
    ]);

    // Check course exists
    if (!course) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.COURSE.NOT_FOUND);
    };

    // Check user enrolled in this course
    if (!enroll) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.ENROLLMENT.REQUIRED)
    };

    // Check if course already completed
    let progress = await progressModel.findOne({ user: userId, course: courseId })
        .select("_id course user completedLessons completed lastAccessLesson")
        .lean()

    // If course completed return data
    if (progress?.completed) {
        return progress;
    };

    // Get moduleIds
    const moduleIds = await moduleModel.distinct("_id", { course: courseId });

    // Parallelize count lesson and valid lesson
    const [totalLessons, validLesson] = await Promise.all([
        lessonModel.countDocuments({ module: { $in: moduleIds } }),
        lessonModel.exists({ _id: lessonId, module: { $in: moduleIds } })
    ]);

    // Check lesson belong to this course
    if (!validLesson) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.LESSON.NOT_IN_COURSE)
    };

    // Update progress
    const updatedProgress = await progressModel.findOneAndUpdate(
        { user: userId, course: courseId },
        {
            $addToSet: { completedLessons: lessonId },
            $set: { lastAccessLesson: lessonId }
        },
        { upsert: true, new: true }
    ).select("_id course user completedLessons completed lastAccessLesson").lean();

    // Mark complete if finished
    const isComplete = totalLessons > 0 && updatedProgress.completedLessons.length === totalLessons;
    if (isComplete && !updatedProgress.completed) {
        progressModel.findByIdAndUpdate(updatedProgress._id, { completed: true }).exec();
        updatedProgress.completed = true;
    }

    // Return data
    return updatedProgress;
};

export const setLastAccessedLessonService = async ({ courseId, lessonId, userId }) => {

    // Validate ids
    validateObjectId(courseId);
    validateObjectId(lessonId);

    // Parallelize course and enrollment existance check
    const [course, enroll] = await Promise.all([
        courseModel.exists({ _id: courseId }),
        enrollmentModel.exists({ user: userId, course: courseId })
    ]);

    // Check course exists
    if (!course) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.COURSE.NOT_FOUND);
    };

    // Check user enrolled in this course
    if (!enroll) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.ENROLLMENT.REQUIRED)
    };

    // Get module ids
    const moduleIds = await moduleModel.distinct("_id", { course: courseId });

    // Check lesson belong to this course
    const validLesson = await lessonModel.exists({ _id: lessonId, module: { $in: moduleIds } });
    if (!validLesson) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.LESSON.NOT_IN_COURSE)
    };

    // Update last lesson
    let progress = await progressModel.findOneAndUpdate(
        { user: userId, course: courseId },
        {
            $set: { lastAccessLesson: lessonId }
        },
        { upsert: true, new: true }
    ).select("_id course user completedLessons completed lastAccessLesson").lean();


    // Return data
    return progress;
};