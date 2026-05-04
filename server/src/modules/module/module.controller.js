import asyncHandler from "../../utils/asyncHandler.js"
import { createModuleService } from "./module.service.js"
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