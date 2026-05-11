import doubtModel from "./doubt.model.js";
import courseModel from "../course/course.model.js"
import lessonModel from "../lesson/lesson.model.js"
import enrollmentModel from "../enrollment/enrollment.model.js"
import replyModel from "./reply.model.js"
import ApiError from "../../utils/apiError.js";
import { HTTP_STATUS, MESSAGES, ROLES } from "../../constants/index.js";
import validateObjectId from "../../utils/validateObjectId.js"


export const createDoubtService = async (courseId, lessonId, title, description, user) => {

    // Check course exist
    const course = await courseModel.findById(courseId);
    if (!course) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.COURSE.NOT_FOUND)
    };

    // Fetch lesson with all details
    const lesson = await lessonModel.findById(lessonId).populate("module", "course");

    // Check lesson exist
    if (!lesson) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.LESSON.NOT_FOUND)
    };

    // Check this lesson belong to this course
    if (lesson.module.course.toString() !== courseId.toString()) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.LESSON.NOT_IN_COURSE)
    };

    // Check enrollment
    const isEnroll = await enrollmentModel.exists({ course: courseId, user: user._id })

    // Check valid authorization
    if (user.role !== ROLES.ADMIN && course.instructor.toString() !== user._id.toString() && !isEnroll) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.DOUBT.NOT_ENROLLED);
    };

    // Create doubt
    const doubt = await doubtModel.create({
        course: courseId,
        lesson: lessonId,
        student: user._id,
        title
    });

    // Populate doubt
    await doubt.populate([
        {
            path: "course",
            select: "title"
        },
        {
            path: "lesson",
            select: "title"
        },
        {
            path: "student",
            select: "name"
        }
    ]);

    // Create reply
    const reply = await replyModel.create({
        doubt: doubt._id,
        author: user._id,
        message: description
    });

    // Populate reply
    await reply.populate(
        "author",
        "name profilePicture role"
    );

    // Return data
    return {
        doubt,
        reply
    };
};

export const getLessonDoubtsService = async (lessonId) => {

    // Check valid id
    validateObjectId(lessonId)

    // Check lesson exist
    const lesson = await lessonModel.exists({ _id: lessonId });
    if (!lesson) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.LESSON.NOT_FOUND)
    };

    const doubts = await doubtModel.find({ lesson: lessonId })
        .populate("student", "name")
        .sort({ lastReplyAt: -1 });

    // Return data
    return doubts
};

export const getMyDoubtsService = async (userId) => {

    // Get user all doubts
    const doubts = await doubtModel.find({ student: userId })
        .sort({ lastReplyAt: -1 });

    // Return data
    return doubts
};

export const getCourseDoubtsService = async (courseId, user, page = 1, limit = 10) => {

    // Check valid id
    validateObjectId(courseId);

    // Check course exist
    const course = await courseModel.findById(courseId);
    if (!course) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.COURSE.NOT_FOUND);
    };

    // Check valid authorization
    if (user.role !== ROLES.ADMIN && course.instructor.toString() !== user._id.toString()) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.DOUBT.UNAUTHORIZED);
    };

    // Calculate page and limit
    const safePage = Math.max(parseInt(page) || 1, 1);
    const safeLimit = Math.min(Math.max(parseInt(limit) || 10, 1), 50);

    // Calculate skip
    const skip = (safePage - 1) * safeLimit;


    // Fetch course doubts
    const doubts = await doubtModel.find({ course: courseId })
        .skip(skip)
        .limit(safeLimit)
        .sort({ lastReplyAt: -1 })
        .populate("student", "name");

    // Total count for pagination
    const total = await doubtModel.countDocuments({ course: courseId });

    // Return data
    return {
        data: doubts,
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

export const getDoubtDetailsService = async (doubtId) => {

    // Check valid id
    validateObjectId(doubtId);

    // Fetch doubt
    const doubt = await doubtModel.findById(doubtId).populate([
        {
            path: "course",
            select: "title"
        },
        {
            path: "lesson",
            select: "title"
        },
        {
            path: "student",
            select: "name"
        }
    ]);

    // Check doubt exists
    if (!doubt) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.DOUBT.NOT_FOUND);
    };

    // Fetch replies
    const replies = await replyModel.find({ doubt: doubtId }).populate(
        "author",
        "name profilePicture role"
    ).sort({ createdAt: 1 })

    // Return data
    return {
        doubt,
        replies
    }
};