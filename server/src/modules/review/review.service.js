import reviewModel from "./review.model.js";
import enrollmentModel from "../enrollment/enrollment.model.js";
import courseModel from "../course/course.model.js";
import ApiError from "../../utils/apiError.js";
import { HTTP_STATUS, MESSAGES, REDIS_TTL } from "../../constants/index.js";
import validateObjectId from "../../utils/validateObjectId.js";
import mongoose from "mongoose";
import { updateCourseRating } from "./review.helper.js";
import { getCache, setCache, deleteCacheByPattern } from "../../utils/cache.js";
import { createNotificationService } from "../notification/notification.service.js"
import log from "../../utils/logger.js";


export const createReviewService = async (rating, message, courseId, studentId) => {

    // Check valid id
    validateObjectId(courseId);

    // Delete review releted cache keys
    await deleteCacheByPattern(`reviews:course:${courseId}:*`)

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

    // Update rating
    await updateCourseRating(courseId);

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

    // Send notification to instructor
    createNotificationService({
        user: course.instructor,
        title: "New Course Review",
        message: "A student submitted a new review for your course.",
        type: "review",
        metadata: {
            course: course._id,
            review: newReview._id
        }
    }).catch(err => log(err, "ERROR"));

    // Return data
    return populatedReview[0];
};

export const getReviewsService = async (courseId, page, limit) => {

    // Check valid id
    validateObjectId(courseId);

    // Calculate page and limit
    const safePage = Math.max(parseInt(page) || 1, 1);
    const safeLimit = Math.min(Math.max(parseInt(limit) || 10, 1), 50);

    // Calculate skip
    const skip = (safePage - 1) * safeLimit;

    // Check chche available 
    const cacheKey = `reviews:course:${courseId}:page:${safePage}:limit:${safeLimit}`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
        return cachedData;
    };

    // parallelize check course and fetch reviews
    const [course, result] = await Promise.all([
        courseModel.exists({ _id: courseId }),
        reviewModel.aggregate([
            { $match: { course: new mongoose.Types.ObjectId(courseId) } },
            {
                $facet: {
                    data: [
                        { $sort: { rating: -1 } },
                        { $skip: skip },
                        { $limit: safeLimit },
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
                    ],
                    total: [{ $count: "count" }]
                }
            }
        ])
    ]);

    // Check course exists
    if (!course) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.COURSE.NOT_FOUND)
    }

    const reviews = result[0].data;
    const total = result[0].total[0]?.count || 0;

    // Make result data for return and caching
    const resultData = {
        data: reviews,
        pagination: {
            total,
            page: safePage,
            limit: safeLimit,
            pages: Math.ceil(total / safeLimit),
            hasNext: safePage * safeLimit < total,
            hasPrev: safePage > 1,
        }
    };

    // Set cache
    await setCache(cacheKey, resultData, REDIS_TTL._5M);

    // Return data
    return resultData;
};

export const updateReviewService = async (data, reviewId, studentId) => {


    // Check valid id
    validateObjectId(reviewId);

    // Check review exists
    const review = await reviewModel.findById(reviewId).select("student course").lean();
    if (!review) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.REVIEW.NOT_FOUND)
    };

    // Check authorization
    if (review.student.toString() !== studentId.toString()) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.REVIEW.UNAUTHORIZED)
    };

    // Delete review releted cache keys
    await deleteCacheByPattern(`reviews:course:${review.course}:*`)

    // Update review 
    const updatedReview = await reviewModel.findByIdAndUpdate(reviewId, data, { returnDocument: "after" }).lean();

    // Update rating
    await updateCourseRating(review.course);

    // Get populated data
    const [populatedReview] = await reviewModel.aggregate([
        { $match: { _id: updatedReview._id } },
        {
            $lookup: {
                from: "users",
                localField: "student",
                foreignField: "_id",
                pipeline: [{ $project: { _id: 1, name: 1, profilePicture: "$profilePicture.url" } }],
                as: "student"
            }
        },
        { $unwind: "$student" },
        {
            $project: {
                _id: 1,
                course: 1,
                student: 1,
                rating: 1,
                message: 1,
                createdAt: 1
            }
        }
    ]);

    // Return data
    return populatedReview;
};

export const deleteReviewService = async (reviewId, studentId) => {


    // Check valid id
    validateObjectId(reviewId);

    // Check review exists
    const review = await reviewModel.findById(reviewId).select("student course").lean();
    if (!review) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.REVIEW.NOT_FOUND)
    };

    // Check authorization
    if (review.student.toString() !== studentId.toString()) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.REVIEW.UNAUTHORIZED)
    };

    // Delete review releted cache keys
    await deleteCacheByPattern(`reviews:course:${review.course}:*`)

    // Delete review 
    await reviewModel.deleteOne({ _id: reviewId });

    // Update rating
    await updateCourseRating(review.course);
};