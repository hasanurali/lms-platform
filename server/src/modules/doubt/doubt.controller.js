import asyncHandler from "../../utils/asyncHandler.js"
import { createDoubtService } from "./doubt.service.js"
import ApiResponse from "../../utils/apiResponse.js"
import { HTTP_STATUS, MESSAGES } from "../../constants/index.js"

export const createDoubt = asyncHandler(async (req, res) => {

    // Get data from request
    const { course, lesson, title, description } = req.body;

    // Get user from request
    const user = req.user;

    // Create doubt
    const { doubt, reply } = await createDoubtService(course, lesson, title, description, user);

    // Send response
    return res
        .status(HTTP_STATUS.CREATED)
        .json(new ApiResponse(MESSAGES.DOUBT.CREATED, { doubt, reply }));
});