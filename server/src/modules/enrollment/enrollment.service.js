import enrollmentModel from "./enrollment.model.js"
import courseModel from "../course/course.model.js";
import ApiError from "../../utils/apiError.js";
import { HTTP_STATUS, MESSAGES } from "../../constants/index.js";
import validateObjectId from "../../utils/validateObjectId.js";


export const createEnrollmentService = async (courseId, userId) => {

    // Check valid id
    validateObjectId(courseId);

    // Fetch course by id
    const course = await courseModel.exists({ _id: courseId });
    if (!course) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.COURSE.NOT_FOUND);
    };

    // Check user enrollment in this course
    const isEnroll = await enrollmentModel.exists({ user: userId, course: courseId });
    if (isEnroll) {
        throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.ENROLLMENT.ALREADY_ENROLLED);
    };

    // Enroll user in the course
    let enrollCourse = await enrollmentModel.create({ user: userId, course: courseId });

    // Get populate course with enrollment
    const populatedEnrollment = await enrollmentModel.findById(enrollCourse._id).populate("course")

    // Return data
    return populatedEnrollment;
};