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

export const getModulesService = async (courseId) => {

    // Check valid id
    validateObjectId(courseId);

    // Check course exist by id
    const isCourse = await courseModel.exists({ _id: courseId });
    if (!isCourse) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.COURSE.NOT_FOUND);
    };

    // Fetch modules
    const modules = await moduleModel.find({ course: courseId }).sort({ order: 1 });

    // Return data
    return modules;
};

export const updateModuleService = async (title, moduleId, instructorId) => {

    // Check valid id
    validateObjectId(moduleId);

    // Check module exist by id
    const isModule = await moduleModel.findById(moduleId);
    if (!isModule) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.MODULE.NOT_FOUND);
    };

    // Check instructor owned this module
    const course = await courseModel.findOne({ _id: isModule.course, instructor: instructorId })
    if (!course) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.COURSE.UNAUTHORIZED)
    }

    // Update module
    const updatedModule = await moduleModel.findByIdAndUpdate(moduleId, { title }, { returnDocument: "after" });

    // Return data
    return updatedModule;
};