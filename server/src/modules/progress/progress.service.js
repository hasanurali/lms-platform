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