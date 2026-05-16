import reviewModel from "./review.model.js";
import enrollmentModel from "../enrollment/enrollment.model.js";
import courseModel from "../course/course.model.js";
import ApiError from "../../utils/apiError.js";
import { HTTP_STATUS, MESSAGES } from "../../constants/index.js";
import validateObjectId from "../../utils/validateObjectId.js";


export const createReviewService = async (rating, message, courseId, studentId) => {

    // Check valid id
    validateObjectId(courseId);

    // Parallelize review existence and enrollment
    const [course, review, enroll] = await Promise.all([
        courseModel.findById(courseId).select("instructor").lean(),
        reviewModel.exists({ course: courseId, student: studentId }),
        enrollmentModel.exists({ user: studentId, course: courseId })
    ]);

    // Check course exists
    if (!course) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.COURSE.NOT_FOUND)
    };

    // Block instructor from reviewing their own course
    if (course.instructor.toString() === studentId.toString()) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.REVIEW.CANNOT_REVIEW_OWN);
    };

    // Check already reviewed this course
    if (review) {
        throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.REVIEW.ALREADY_EXISTS)
    };

    // Check student enrollment in this course
    if (!enroll) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.REVIEW.NOT_ENROLLED)
    };

    // Create review
    const newReview = await reviewModel.create({
        course: courseId,
        student: studentId,
        rating,
        message
    });

    // Get populated data
    const populatedReview = await reviewModel.aggregate([
        { $match: { _id: newReview._id } },
        {
            $lookup: {
                from: "users",
                localField: "student",
                foreignField: "_id",
                pipeline: [{ $project: { _id: 1, name: 1, profilePicture: "$profilePicture.url" } }],
                as: "user"
            }
        },
        { $unwind: "$user" },
        {
            $project: {
                _id: 1,
                course: 1,
                student: "$user",
                rating: 1,
                message: 1,
                createdAt: 1
            }
        }
    ]);

    // Return data
    return populatedReview[0];
};