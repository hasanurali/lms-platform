import doubtModel from "./doubt.model.js";
import courseModel from "../course/course.model.js"
import lessonModel from "../lesson/lesson.model.js"
import enrollmentModel from "../enrollment/enrollment.model.js"
import replyModel from "./reply.model.js"
import ApiError from "../../utils/apiError.js";
import { HTTP_STATUS, MESSAGES, ROLES } from "../../constants/index.js";


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
