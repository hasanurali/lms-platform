import mongoose from "mongoose"
import courseModel from "./course.model.js"
import moduleModel from "../module/module.model.js"
import lessonModel from "../lesson/lesson.model.js"
import progressModel from "../progress/progress.model.js"
import enrollmentModel from "../enrollment/enrollment.model.js"
import doubtModel from "../doubt/doubt.model.js"
import replyModel from "../doubt/reply.model.js"
import ApiError from "../../utils/apiError.js";
import { HTTP_STATUS, MESSAGES, CLOUDINARY, REDIS_TTL } from "../../constants/index.js";
import validateObjectId from "../../utils/validateObjectId.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../../utils/Cloudinary.js"
import crypto from "crypto";
import { getCache, setCache, deleteCacheByPattern } from "../../utils/cache.js";


// Common population for instructor
const commonPopulate = {
    path: "instructor",
    select: "name email profilePicture"
};

// Common course selection fields
const commonCourseSelection = "_id title description thumbnail instructor price isPublished averageRating totalReviews ratingDistribution"

export const createCourseService = async (data) => {

    const { thumbnailFile } = data;

    // Check thumbnail file is provided
    if (!thumbnailFile) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.COURSE.THUMBNAIL_REQUIRED);
    };

    // Upload thumbnail to cloudinary
    const { url, public_id, hash } = await uploadToCloudinary(thumbnailFile, CLOUDINARY.FOLDER.THUMBNAIL);
    data.thumbnail = {
        url,
        publicId: public_id,
        hash
    }

    delete data.thumbnailFile;

    // Create course
    const course = await courseModel.create(data);

    // Get populated data with aggregate
    const [populatedData] = await courseModel.aggregate([
        { $match: { _id: course._id } },
        {
            $lookup: {
                from: "users",
                localField: "instructor",
                foreignField: "_id",
                pipeline: [{ $project: { name: 1, email: 1, profilePicture: "$profilePicture.url" } }],
                as: "instructor"
            }
        },
        { $unwind: "$instructor" },
        {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                thumbnail: "$thumbnail.url",
                instructor: 1,
                price: 1,
                isPublished: 1,
                averageRating: 1,
                totalReviews: 1,
                ratingDistribution: 1
            }
        }
    ]);

    // Return data
    return populatedData;
};

export const getCoursesService = async (page = 1, limit = 10) => {

    // Calculate page and limit
    const safePage = Math.max(parseInt(page) || 1, 1);
    const safeLimit = Math.min(Math.max(parseInt(limit) || 10, 1), 50);

    // Calculate skip
    const skip = (safePage - 1) * safeLimit;

    // Check chche available 
    const cacheKey = `courses:page:${safePage}:limit:${safeLimit}`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
        return cachedData;
    }


    // Fetch courses
    const result = await courseModel.aggregate([
        { $match: { isPublished: true } },
        {
            $facet: {
                data: [
                    { $sort: { createdAt: -1 } },
                    { $skip: skip },
                    { $limit: safeLimit },
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            description: 1,
                            thumbnail: "$thumbnail.url",
                            instructor: 1,
                            price: 1,
                            isPublished: 1,
                            averageRating: 1,
                            totalReviews: 1,
                            ratingDistribution: 1
                        }
                    }
                ],
                total: [{ $count: "count" }]
            }
        }
    ]);

    const courses = result[0].data;
    const total = result[0].total[0]?.count || 0;

    // Make result data for return and caching
    const resultData = {
        data: courses,
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

export const getMyCoursesService = async (instructorId, page = 1, limit = 10) => {

    // Calculate page and limit
    const safePage = Math.max(parseInt(page) || 1, 1);
    const safeLimit = Math.min(Math.max(parseInt(limit) || 10, 1), 50);

    // Calculate skip
    const skip = (safePage - 1) * safeLimit;

    // Fetch courses
    const result = await courseModel.aggregate([
        { $match: { instructor: instructorId } },
        {
            $facet: {
                data: [
                    { $sort: { createdAt: -1 } },
                    { $skip: skip },
                    { $limit: safeLimit },
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            description: 1,
                            thumbnail: "$thumbnail.url",
                            instructor: 1,
                            price: 1,
                            isPublished: 1,
                            averageRating: 1,
                            totalReviews: 1,
                            ratingDistribution: 1
                        }
                    }
                ],
                total: [{ $count: "count" }]
            }
        }
    ]);

    const courses = result[0].data;
    const total = result[0].total[0]?.count || 0;

    // Return data
    return {
        data: courses,
        pagination: {
            total,
            page: safePage,
            limit: safeLimit,
            pages: Math.ceil(total / safeLimit),
            hasNext: safePage * safeLimit < total,
            hasPrev: safePage > 1,
        }
    };
};

export const getFullCourseService = async (courseId, userId) => {

    // Check chche available 
    const cacheKey = userId ? `course-full:${courseId}:user:${userId}` : `course-full:${courseId}:guest`
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
        return cachedData;
    };

    // Validate ID
    validateObjectId(courseId);

    // parallelize independent calls
    const [course, modules, progress] = await Promise.all([
        courseModel.findById(courseId).populate(commonPopulate).select(commonCourseSelection).lean(),
        moduleModel.find({ course: courseId }).sort({ order: 1 }).select("_id course title").lean(),
        userId ? progressModel.findOne({ user: userId, course: courseId }).lean() : Promise.resolve(null)
    ]);

    // Check course exists
    if (!course) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.COURSE.NOT_FOUND);
    }

    // Convert modules to module ids
    const moduleIds = modules.map(m => new mongoose.Types.ObjectId(m._id));

    // Get lessons
    const lessons = await lessonModel.aggregate([
        { $match: { module: { $in: moduleIds } } },
        { $sort: { order: 1 } },
        {
            $project: {
                _id: 1,
                module: 1,
                title: 1,
                content: 1,
                video: "$video.url",
                order: 1
            }
        }
    ]);

    // Group lessons by module
    const lessonMap = new Map();
    lessons.forEach(lesson => {
        const moduleId = lesson.module.toString();

        lessonMap.has(moduleId) ?
            lessonMap.get(moduleId).push(lesson)
            :
            lessonMap.set(moduleId, [lesson])
    });

    // Attach lessons to modules
    const modulesWithLessons = modules.map(module => ({
        ...module,
        lessons: lessonMap.get(module._id.toString()) || []
    }));

    // Add completion flag to lessons
    if (progress) {
        let completedSet = new Set(progress.completedLessons.map(_id => _id.toString()));

        modulesWithLessons.forEach(module => {
            module.lessons = module.lessons.map(lesson => ({
                ...lesson,
                completed: completedSet.has(lesson._id.toString())
            }));
        });
    };

    // Calculate progress percentage
    let progressPercentage = 0
    if (progress && lessons.length > 0) {
        progressPercentage = Math.round((progress.completedLessons.length / lessons.length) * 100);
    };

    // Make result data for return and caching
    const resultData = {
        course: {
            ...course,
            thumbnail: course.thumbnail?.url,
            instructor: {
                _id: course.instructor._id,
                name: course.instructor.name,
                email: course.instructor.email,
                profilePicture: course.instructor.profilePicture?.url,
            }
        },
        modules: modulesWithLessons,
        progress: {
            percentage: progressPercentage,
            completed: progress?.completed || false,
            lastAccessLesson: progress?.lastAccessLesson || null
        }
    };

    // Set cache
    await setCache(cacheKey, resultData, REDIS_TTL._5M);

    // Return data
    return resultData;
};

export const getCourseService = async (courseId) => {

    // Check chche available 
    const cacheKey = `course:${courseId}`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
        return cachedData;
    };

    // Check valid id
    validateObjectId(courseId);

    // Fetch course by id
    const course = await courseModel.findById(courseId).populate(commonPopulate)
        .select(commonCourseSelection)
        .lean();

    // Check course exists
    if (!course) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.COURSE.NOT_FOUND);
    };

    // Make result data for return and caching
    const resultData = {
        ...course,
        thumbnail: course.thumbnail?.url,
        instructor: {
            _id: course.instructor._id,
            name: course.instructor.name,
            email: course.instructor.email,
            profilePicture: course.instructor.profilePicture?.url
        }
    }

    // Set cache
    await setCache(cacheKey, resultData, REDIS_TTL._10M);

    // Return data
    return resultData
};

export const updateCourseService = async (data, instructorId, courseId) => {

    // Delete course releted cache keys
    await Promise.all([
        deleteCacheByPattern(`courses:*`),
        deleteCacheByPattern(`course:${courseId}`),
        deleteCacheByPattern(`course-full:${courseId}:*`),
        deleteCacheByPattern(`modules:course:${courseId}`)
    ]);

    const { thumbnailFile } = data;

    // Check valid id
    validateObjectId(courseId);

    // Fetch course by id
    const course = await courseModel.findById(courseId).select("instructor thumbnail").lean();
    if (!course) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.COURSE.NOT_FOUND);
    };

    // Check instructor is owned this course
    if (instructorId.toString() !== course.instructor.toString()) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.COURSE.UNAUTHORIZED);
    };


    if (thumbnailFile) {

        const currentThumbnailHash = crypto.createHash("md5").update(thumbnailFile.buffer).digest("hex");

        // Check if same thumbnail
        if (course.thumbnail?.hash !== currentThumbnailHash) {

            // Upload new thumbnail while deleting the old one
            const [uploadResult] = await Promise.all([
                uploadToCloudinary(thumbnailFile, CLOUDINARY.FOLDER.THUMBNAIL),
                course.thumbnail?.publicId ? deleteFromCloudinary(course.thumbnail?.publicId) : Promise.resolve()
            ]);

            data.thumbnail = {
                url: uploadResult.url,
                publicId: uploadResult.public_id,
                hash: uploadResult.hash
            };
        }
        delete data.thumbnailFile;
    }

    // Update course
    const updatedCourse = await courseModel.findByIdAndUpdate(courseId, data, { returnDocument: "after" })
        .populate(commonPopulate)
        .select(commonCourseSelection)
        .lean();

    // Return data
    return {
        ...updatedCourse,
        thumbnail: updatedCourse.thumbnail?.url,
        instructor: {
            _id: updatedCourse.instructor._id,
            name: updatedCourse.instructor.name,
            email: updatedCourse.instructor.email,
            profilePicture: updatedCourse.instructor.profilePicture?.url
        }
    }
};

export const deleteCourseService = async (instructorId, courseId) => {

    // Check valid id
    validateObjectId(courseId);

    // Fetch course by id
    const course = await courseModel.findById(courseId).select("instructor thumbnail").lean();
    if (!course) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.COURSE.NOT_FOUND);
    };

    // Check instructor is owned this course
    if (instructorId.toString() !== course.instructor.toString()) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.COURSE.UNAUTHORIZED);
    };

    // parallelize independent find
    const [moduleIds, doubtIds] = await Promise.all([
        moduleModel.distinct("_id", { course: courseId }),
        doubtModel.distinct("_id", { course: courseId })
    ]);

    // Get all lessons of those modules
    const lessons = await lessonModel.find({ module: { $in: moduleIds } }).select("video.publicId -_id").lean();

    // parallelize independent deletes
    await Promise.all([
        deleteCacheByPattern(`courses:*`),
        deleteCacheByPattern(`course:${courseId}`),
        deleteCacheByPattern(`course-full:${courseId}:*`),
        deleteCacheByPattern(`modules:course:${courseId}`),
        deleteCacheByPattern(`progress:*:${courseId}`),
        progressModel.deleteMany({ course: courseId }),
        enrollmentModel.deleteMany({ course: courseId }),
        lessonModel.deleteMany({ module: { $in: moduleIds } }),
        moduleModel.deleteMany({ course: courseId }),
        replyModel.deleteMany({ doubt: { $in: doubtIds } }),
        doubtModel.deleteMany({ course: courseId }),
        courseModel.deleteOne({ _id: courseId }),
        deleteFromCloudinary(course.thumbnail.publicId),
        ...lessons.map(({ video }) => deleteFromCloudinary(video.publicId, CLOUDINARY.TYPE.VIDEO))
    ]);
};