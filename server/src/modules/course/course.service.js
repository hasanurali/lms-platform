import courseModel from "./course.model.js"


// Common population for instructor
const commonPopulate = {
    path: "instructor",
    select: "name email"
};

export const createCourseService = async (data) => {

    // Create course
    const course = await courseModel.create(data);

    // Get populated instructor data with course
    const populatedData = await courseModel.findById(course._id).populate(commonPopulate)

    // Return data
    return populatedData;
};