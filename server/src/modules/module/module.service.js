import courseModel from "../course/course.model.js"
import moduleModel from "./module.model.js"
import ApiError from "../../utils/apiError.js";
import { HTTP_STATUS, MESSAGES } from "../../constants/index.js";
import validateObjectId from "../../utils/validateObjectId.js";


export const createModuleService = async (title, instructorId, courseId) => {

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

    // Check module order
    const lastModule = await moduleModel.findOne({ course: courseId }).sort({ order: -1 });

    // Set module order
    const order = lastModule ? lastModule.order + 1 : 1;

    // Create new module
    let module = await moduleModel.create({
        course: courseId,
        title,
        order
    });

    // Return data
    return module;
};