import courseModel from "../course/course.model.js"
import moduleModel from "./module.model.js"
import lessonModel from "../lesson/lesson.model.js"
import ApiError from "../../utils/apiError.js";
import { HTTP_STATUS, MESSAGES, CLOUDINARY } from "../../constants/index.js";
import validateObjectId from "../../utils/validateObjectId.js";
import { deleteFromCloudinary } from "../../utils/cloudinary.js"


export const createModuleService = async (title, instructorId, courseId) => {

    // Check valid id
    validateObjectId(courseId);

    // Parallelize db calls for find course instructor and last module
    const [course, lastModule] = await Promise.all([
        courseModel.findById(courseId).select("instructor").lean(),
        moduleModel.findOne({ course: courseId }).sort({ order: -1 }).select("order").lean()
    ]);

    // Check course exists
    if (!course) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.COURSE.NOT_FOUND);
    };

    // Check instructor is owned this course
    if (instructorId.toString() !== course.instructor.toString()) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.MODULE.UNAUTHORIZED);
    };

    // Set module order
    const order = lastModule ? lastModule.order + 1 : 1;

    // Create new module
    let module = await moduleModel.create({
        course: courseId,
        title,
        order
    });

    // Return data
    return {
        _id: module._id,
        title: module.title,
        course: module.course,
        order: module.order
    };
};

export const getModulesService = async (courseId) => {

    // Check valid id
    validateObjectId(courseId);

    // Parallelize db call for check course and find module
    const [course, modules] = await Promise.all([
        courseModel.exists({ _id: courseId }),
        moduleModel.find({ course: courseId }).sort({ order: 1 }).select("_id title course order").lean()
    ]);

    // Check course exist by id
    if (!course) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.COURSE.NOT_FOUND);
    };

    // Return data
    return modules;
};

export const updateModuleService = async (title, moduleId, instructorId) => {

    // Check valid id
    validateObjectId(moduleId);

    // Check module exist by id
    const module = await moduleModel.findById(moduleId).select("course").lean();
    if (!module) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.MODULE.NOT_FOUND);
    };

    // Check instructor owned this module
    const course = await courseModel.exists({ _id: module.course, instructor: instructorId })
    if (!course) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.MODULE.UNAUTHORIZED)
    }

    // Update module
    const updatedModule = await moduleModel.findByIdAndUpdate(moduleId, { title }, { returnDocument: "after" })
        .select("_id title course order")
        .lean();

    // Return data
    return updatedModule;
};

export const deleteModuleService = async (moduleId, instructorId) => {

    // Check valid id
    validateObjectId(moduleId);

    // Check module exist by id
    const module = await moduleModel.findById(moduleId).select("course").lean();
    if (!module) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.MODULE.NOT_FOUND);
    };

    // Check instructor owned this module
    const course = await courseModel.exists({ _id: module.course, instructor: instructorId })
    if (!course) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.MODULE.UNAUTHORIZED)
    };

    // Get all lessons of this module
    const lessons = await lessonModel.find({ module: moduleId }).select("video -_id").lean();

    // parallelize independent deletes
    await Promise.all([
        lessonModel.deleteMany({ module: moduleId }),
        moduleModel.deleteOne({ _id: moduleId }),
        ...lessons.map(({ video }) => deleteFromCloudinary(video.publicId, CLOUDINARY.TYPE.VIDEO))
    ]);
};