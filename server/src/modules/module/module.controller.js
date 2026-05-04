import asyncHandler from "../../utils/asyncHandler.js"
import { createModuleService, getModulesService, updateModuleService } from "./module.service.js"
import ApiResponse from "../../utils/apiResponse.js"
import { HTTP_STATUS, MESSAGES } from "../../constants/index.js"

export const createModule = asyncHandler(async (req, res) => {

    // Get data from request
    const { title } = req.body;

    // Get course id from request
    const courseId = req.params.id;

    // Get instructor id from request
    const instructorId = req.user._id;

    // Create module
    const module = await createModuleService(title, instructorId, courseId);

    // Send response
    return res
        .status(HTTP_STATUS.CREATED)
        .json(new ApiResponse(MESSAGES.MODULE.CREATED, module));
});

export const getModules = asyncHandler(async (req, res) => {

    // Get course id from request
    const courseId = req.params.id;

    // Get modules
    const modules = await getModulesService(courseId);

    // Send response
    return res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse(MESSAGES.MODULE.FETCHED, modules));
});

export const updateModule = asyncHandler(async (req, res) => {

    // Get data from request
    const { title } = req.body;

    // Get module id from request
    const moduleId = req.params.id;

    // Get instructor id from request
    const instructorId = req.user._id

    // Update module
    const module = await updateModuleService(title, moduleId, instructorId);

    // Send response
    return res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse(MESSAGES.MODULE.UPDATED, module));
});