import mongoose from "mongoose";
import doubtModel from "./doubt.model.js";
import courseModel from "../course/course.model.js"
import lessonModel from "../lesson/lesson.model.js"
import enrollmentModel from "../enrollment/enrollment.model.js"
import replyModel from "./reply.model.js"
import ApiError from "../../utils/apiError.js";
import { HTTP_STATUS, MESSAGES, ROLES, DOUBT_STATUS, NOTIFICATION_TYPE, SOCKET_EVENTS } from "../../constants/index.js";
import validateObjectId from "../../utils/validateObjectId.js"
import { createNotificationService } from "../notification/notification.service.js"
import log from "../../utils/logger.js";
import { getIO } from "../../socket/socket.js"


// fetch doubt with instructor function
const getDoubtWithInstructor = async (doubtId) => {
    const [doubt] = await doubtModel.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(doubtId) } },
        {
            $lookup: {
                from: "courses",
                localField: "course",
                foreignField: "_id",
                pipeline: [{ $project: { instructor: 1 } }],
                as: "course"
            }
        },
        { $unwind: "$course" },
        {
            $project: {
                _id: 1,
                title: 1,
                status: 1,
                student: 1,
                course: { _id: 1, instructor: "$course.instructor" },
                lesson: 1
            }
        }
    ]);

    return doubt;
}

export const createDoubtService = async (courseId, lessonId, title, description, user) => {

    // parallelize course, lesson and enrollment checks
    const [course, lesson, enroll] = await Promise.all([
        courseModel.findById(courseId).select("instructor").lean(),
        lessonModel.findById(lessonId).populate({ path: "module", select: "course" }).select("module").lean(),
        enrollmentModel.exists({ course: courseId, user: user._id })
    ]);

    // Check course exists
    if (!course) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.COURSE.NOT_FOUND)
    };

    // Check lesson exist
    if (!lesson) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.LESSON.NOT_FOUND)
    };

    // Check this lesson belong to this course
    if (lesson.module.course.toString() !== courseId.toString()) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.LESSON.NOT_IN_COURSE)
    };

    // Check valid authorization
    if (user.role !== ROLES.ADMIN && course.instructor.toString() !== user._id.toString() && !enroll) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.DOUBT.NOT_ENROLLED);
    };

    // Create doubt
    const doubt = await doubtModel.create({ course: courseId, lesson: lessonId, student: user._id, title });

    // parallelize reply creation and doubt population
    const [reply] = await Promise.all([
        replyModel.create({ doubt: doubt._id, author: user._id, message: description }),
        doubt.populate([
            { path: "course", select: "title" },
            { path: "lesson", select: "title" },
            { path: "student", select: "name" }
        ])
    ]);

    // Get populated reply
    const [populatedReply] = await replyModel.aggregate([
        { $match: { _id: reply._id } },
        {
            $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                pipeline: [{ $project: { name: 1, profilePicture: "$profilePicture.url", role: 1 } }],
                as: "author"
            }
        },
        { $unwind: "$author" },
        {
            $project: {
                _id: 1,
                doubt: 1,
                author: 1,
                message: 1,
                createdAt: 1
            }
        }
    ]);

    // Send notification to instructor
    if (course.instructor.toString() !== user._id.toString()) {
        createNotificationService({
            user: course.instructor,
            title: "New Doubt Posted",
            message: "A student asked a new doubt in your course.",
            type: NOTIFICATION_TYPE.doubt,
            metadata: {
                course: course._id,
                lesson: lessonId,
                doubt: doubt._id
            }
        }).catch(err => log(err, "ERROR"));
    };

    // Send doubt to the instructor
    let io = getIO()
    io.to(`user:${course.instructor.toString()}`).emit(
        SOCKET_EVENTS.NEW_DOUBT,
        {
            _id: doubt._id,
            title: doubt.title,
            status: doubt.status,
            student: doubt.student,
            lastReplyAt: doubt.lastReplyAt
        }
    );

    // Return data
    return {
        doubt: {
            _id: doubt._id,
            title: doubt.title,
            course: doubt.course,
            lesson: doubt.lesson,
            student: doubt.student,
            status: doubt.status,
            lastReplyAt: doubt.lastReplyAt
        },
        reply: populatedReply
    }
};

export const getLessonDoubtsService = async (lessonId) => {

    // Check valid id
    validateObjectId(lessonId)

    // parallelize check lesson and fetch doubts
    const [lesson, doubts] = await Promise.all([
        lessonModel.exists({ _id: lessonId }),
        doubtModel.aggregate([
            { $match: { lesson: new mongoose.Types.ObjectId(lessonId) } },
            { $sort: { lastReplyAt: -1 } },
            {
                $lookup: {
                    from: "users",
                    localField: "student",
                    foreignField: "_id",
                    pipeline: [{ $project: { name: 1 } }],
                    as: "student"
                }
            },
            { $unwind: "$student" },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    status: 1,
                    student: 1,
                    lastReplyAt: 1
                }
            }
        ])
    ]);

    // Check lesson exists
    if (!lesson) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.LESSON.NOT_FOUND)
    };

    // Return data
    return doubts
};

export const getMyDoubtsService = async (userId) => {

    // Get user all doubts
    const doubts = await doubtModel.find({ student: userId })
        .select("_id course lesson title status lastReplyAt")
        .sort({ lastReplyAt: -1 })
        .lean();

    // Return data
    return doubts
};

export const getCourseDoubtsService = async (courseId, user, page = 1, limit = 10) => {

    // Check valid id
    validateObjectId(courseId);

    // Check course exist
    const course = await courseModel.findById(courseId).select("instructor").lean();
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

    // Fetch doubts
    const result = await doubtModel.aggregate([
        { $match: { course: new mongoose.Types.ObjectId(courseId) } },
        {
            $facet: {
                data: [
                    { $sort: { lastReplyAt: -1 } },
                    { $skip: skip },
                    { $limit: safeLimit },
                    {
                        $lookup: {
                            from: "users",
                            localField: "student",
                            foreignField: "_id",
                            pipeline: [{ $project: { name: 1 } }],
                            as: "student"
                        }
                    },
                    { $unwind: "$student" },
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            status: 1,
                            student: 1,
                            lastReplyAt: 1
                        }
                    }
                ],
                total: [{ $count: "count" }]
            }
        }
    ]);

    const doubts = result[0].data;
    const total = result[0].total[0]?.count || 0;

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
    ]).select("_id title course lesson student status lastReplyAt").lean();

    // Check doubt exists
    if (!doubt) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.DOUBT.NOT_FOUND);
    };

    // Fetch replies
    const replies = await replyModel.aggregate([
        { $match: { doubt: new mongoose.Types.ObjectId(doubtId) } },
        { $sort: { createdAt: 1 } },
        {
            $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                pipeline: [{ $project: { name: 1, profilePicture: "$profilePicture.url", role: 1 } }],
                as: "author"
            }
        },
        { $unwind: "$author" },
        {
            $project: {
                _id: 1,
                doubt: 1,
                author: 1,
                message: 1,
                createdAt: 1
            }
        }
    ]);

    // Return data
    return { doubt, replies }
};

export const replyToDoubtService = async (message, doubtId, user) => {

    // Check valid id
    validateObjectId(doubtId);

    // Fetch doubt details
    const doubt = await getDoubtWithInstructor(doubtId);

    // Check doubt exists
    if (!doubt) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.DOUBT.NOT_FOUND);
    };

    // Check doubt is close
    if (doubt.status === DOUBT_STATUS.CLOSED) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.DOUBT.ALREADY_CLOSED);
    };

    // Check valid authorization
    if (user.role !== ROLES.ADMIN
        && doubt.course.instructor.toString() !== user._id.toString()
        && doubt.student.toString() !== user._id.toString()) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.DOUBT.UNAUTHORIZED);
    };

    // Create reply
    const reply = await replyModel.create({
        doubt: doubtId,
        author: user._id,
        message
    });

    // Update last reply timestamp
    doubtModel.findByIdAndUpdate(doubtId, { lastReplyAt: new Date() }).exec();

    // Populate reply
    const [populatedReply] = await replyModel.aggregate([
        { $match: { _id: reply._id } },
        {
            $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                pipeline: [{ $project: { name: 1, profilePicture: "$profilePicture.url", role: 1 } }],
                as: "author"
            }
        },
        { $unwind: "$author" },
        {
            $project: {
                _id: 1,
                doubt: 1,
                author: 1,
                message: 1,
                createdAt: 1
            }
        }
    ]);

    // Send notification to user
    if (doubt.student.toString() !== user._id.toString()) {
        createNotificationService({
            user: doubt.student,
            title: "New Reply to Your Doubt",
            message: "Your doubt received a new reply.",
            type: NOTIFICATION_TYPE.doubt,
            metadata: {
                course: doubt.course._id,
                lesson: doubt.lesson,
                doubt: doubt._id
            }
        }).catch(err => log(err, "ERROR"));
    };

    // Send reply to doubt room
    let io = getIO()
    io.to(`doubt:${doubtId.toString()}`).except(`user:${user._id.toString()}`).emit(
        SOCKET_EVENTS.NEW_DOUBT_REPLY,
        populatedReply
    );

    // Return data
    return populatedReply;
};

export const markDoubtAnsweredService = async (doubtId, user) => {

    // Check valid id
    validateObjectId(doubtId);

    // Fetch doubt details
    const doubt = await getDoubtWithInstructor(doubtId);

    // Check doubt exists
    if (!doubt) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.DOUBT.NOT_FOUND);
    };

    // Check doubt is close
    if (doubt.status === DOUBT_STATUS.CLOSED) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.DOUBT.ALREADY_CLOSED);
    };

    // Check doubt is answered
    if (doubt.status === DOUBT_STATUS.ANSWERED) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.DOUBT.ALREADY_ANSWERED);
    };

    // Check valid authorization
    if (user.role !== ROLES.ADMIN && doubt.course.instructor.toString() !== user._id.toString()) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.DOUBT.ONLY_INSTRUCTOR_CAN_ANSWER);
    };

    // Marked the doubt as answered and get populated data
    const answeredDoubt = await doubtModel.findByIdAndUpdate(
        doubtId,
        { status: DOUBT_STATUS.ANSWERED },
        { returnDocument: "after" }
    ).populate([
        { path: "course", select: "title" },
        { path: "lesson", select: "title" },
        { path: "student", select: "name" }
    ]).select("_id title course lesson student status lastReplyAt").lean();

    // Send notification to instructor
    if (doubt.student.toString() !== user._id.toString()) {
        createNotificationService({
            user: doubt.student,
            title: "Doubt Answered",
            message: `Your doubt "${doubt.title}" has been marked as answered.`,
            type: NOTIFICATION_TYPE.doubt,
            metadata: {
                course: doubt.course._id,
                lesson: doubt.lesson,
                doubt: doubt._id
            }
        }).catch(err => log(err, "ERROR"));
    }

    // Send marked doubt to the user
    let io = getIO()
    io.to(`doubt:${doubtId.toString()}`).except(`user:${user._id.toString()}`).emit(
        SOCKET_EVENTS.DOUBT_STATUS_UPDATED,
        answeredDoubt
    );

    // Return data
    return answeredDoubt;
};

export const closeDoubtService = async (doubtId, userId) => {

    // Check valid id
    validateObjectId(doubtId);

    // Check doubt exists
    const doubt = await doubtModel.findById(doubtId).select("status student").lean();
    if (!doubt) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.DOUBT.NOT_FOUND);
    };

    // Check doubt is close
    if (doubt.status === DOUBT_STATUS.CLOSED) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.DOUBT.ALREADY_CLOSED);
    };

    // Check valid authorization
    if (doubt.student.toString() !== userId.toString()) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.DOUBT.ONLY_OWNER_CAN_CLOSE);
    };

    // Marked the doubt as close and get populated data
    const closedDoubt = await doubtModel.findByIdAndUpdate(
        doubtId,
        { status: DOUBT_STATUS.CLOSED },
        { returnDocument: "after" }
    ).populate([
        { path: "course", select: "title" },
        { path: "lesson", select: "title" },
        { path: "student", select: "name" }
    ]).select("_id title course lesson student status lastReplyAt").lean();

    // Send closed doubt to the room
    let io = getIO()
    io.to(`doubt:${doubtId.toString()}`).except(`user:${userId.toString()}`).emit(
        SOCKET_EVENTS.DOUBT_STATUS_UPDATED,
        closedDoubt
    );

    // Return data
    return closedDoubt;
};