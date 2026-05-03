import asyncHandler from "../../utils/asyncHandler.js"
import { createCourseService } from "./course.service.js"
import ApiResponse from "../../utils/apiResponse.js"
import { HTTP_STATUS, MESSAGES } from "../../constants/index.js"

export const createCourse = asyncHandler(async (req, res) => {

    //Get data from request
    const { title, description, price, thumbnail } = req.body;

    // Get instructor id from request
    const instructorId = req.user._id;

    // Create course
    const course = await createCourseService({ title, description, instructor: instructorId, price, thumbnail });

    // Send response
    return res
        .status(HTTP_STATUS.CREATED)
        .json(new ApiResponse(MESSAGES.COURSE.CREATED, course));
});