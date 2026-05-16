import enrollmentModel from "./enrollment.model.js"
import courseModel from "../course/course.model.js";
import ApiError from "../../utils/apiError.js";
import { HTTP_STATUS, MESSAGES, REDIS_TTL } from "../../constants/index.js";
import validateObjectId from "../../utils/validateObjectId.js";
import { getCache, setCache, deleteCacheByPattern } from "../../utils/cache.js";


export const createEnrollmentService = async (courseId, userId) => {

    // Delete enrollment releted cache keys
    await deleteCacheByPattern(`enrollments:${userId}`)

    // Check valid id
    validateObjectId(courseId);

    // parallelize fetch course and check enrollment
    const [course, enroll] = await Promise.all([
        courseModel.exists({ _id: courseId }),
        enrollmentModel.exists({ user: userId, course: courseId })
    ]);

    // Check course exists
    if (!course) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.COURSE.NOT_FOUND);
    };

    // Check user enrollment in this course
    if (enroll) {
        throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.ENROLLMENT.ALREADY_ENROLLED);
    };

    // Enroll user in the course
    let enrollCourse = await enrollmentModel.create({ user: userId, course: courseId });

    // Get populated course with enrollment
    const populatedEnrollment = await enrollmentModel.aggregate([
        { $match: { _id: enrollCourse._id } },
        {
            $lookup: {
                from: "courses",
                localField: "course",
                foreignField: "_id",
                as: "course"
            }
        },
        { $unwind: "$course" },
        {
            $project: {
                _id: 1,
                user: 1,
                course: {
                    _id: "$course._id",
                    title: "$course.title",
                    description: "$course.description",
                    thumbnail: "$course.thumbnail.url",
                    instructor: "$course.instructor",
                    price: "$course.price",
                    isPublished: "$course.isPublished",
                    averageRating: "$course.averageRating",
                    totalReviews: "$course.totalReviews",
                    ratingDistribution: "$course.ratingDistribution"
                }
            }
        }
    ]);

    // Return data
    return populatedEnrollment[0];
};

export const getEnrollmentsService = async (userId) => {

    // Check chche available 
    const cacheKey = `enrollments:${userId}`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
        return cachedData;
    };

    // Fetch user enrolled courses
    let enrollCourses = await enrollmentModel.aggregate([
        { $match: { user: userId } },
        {
            $lookup: {
                from: "courses",
                localField: "course",
                foreignField: "_id",
                as: "course"
            }
        },
        {
            $unwind: {
                path: "$course",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
                _id: 1,
                user: 1,
                course: {
                    _id: "$course._id",
                    title: "$course.title",
                    description: "$course.description",
                    thumbnail: "$course.thumbnail.url",
                    instructor: "$course.instructor",
                    price: "$course.price",
                    isPublished: "$course.isPublished",
                    averageRating: "$course.averageRating",
                    totalReviews: "$course.totalReviews",
                    ratingDistribution: "$course.ratingDistribution"
                }
            }
        }
    ]);

    // Set cache
    await setCache(cacheKey, enrollCourses, REDIS_TTL._5M)

    // Return data
    return enrollCourses;
};