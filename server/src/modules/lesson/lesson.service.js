import mongoose from "mongoose";
import lessonModel from "./lesson.model.js"
import moduleModel from "../module/module.model.js";
import enrollmentModel from "../enrollment/enrollment.model.js"
import doubtModel from "../doubt/doubt.model.js";
import replyModel from "../doubt/reply.model.js";
import ApiError from "../../utils/apiError.js";
import { HTTP_STATUS, MESSAGES, ROLES, CLOUDINARY, REDIS_TTL } from "../../constants/index.js";
import validateObjectId from "../../utils/validateObjectId.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../../utils/cloudinary.js";
import crypto from "crypto"
import { getCache, setCache, deleteCacheByPattern } from "../../utils/cache.js";


// Get instructor aggregation function
const getInstructorId = async (lessonId) => {
    const result = await lessonModel.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(lessonId) } },
        {
            $lookup: {
                from: "modules",
                localField: "module",
                foreignField: "_id",
                as: "module"
            }
        },
        { $unwind: "$module" },
        {
            $lookup: {
                from: "courses",
                localField: "module.course",
                foreignField: "_id",
                pipeline: [{ $project: { instructor: 1 } }],
                as: "course"
            }
        },
        { $unwind: "$course" },
        {
            $project: {
                _id: 0,
                video: 1,
                instructorId: "$course.instructor",
                courseId: "$course._id",
                moduleId: "$module._id"
            }
        }
    ]);
    return result[0] || null;
};

export const createLessonService = async (title, videoFile, content, moduleId, instructorId) => {

    // Check valid id
    validateObjectId(moduleId);

    // Check video file is provided
    if (!videoFile) {
        throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.LESSON.VIDEO_REQUIRED);
    };

    // Fetch module by id
    const module = await moduleModel.findById(moduleId)
        .populate({ path: "course", select: "instructor" })
        .select("course -_id").lean();

    if (!module) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.MODULE.NOT_FOUND);
    };

    // Check instructor is owned this module
    if (instructorId.toString() !== module.course.instructor.toString()) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.LESSON.UNAUTHORIZED);
    };

    // Parallelize uplode video to cloudinary and get lesson order
    const [uplodeData, lastLesson] = await Promise.all([
        uploadToCloudinary(videoFile, CLOUDINARY.FOLDER.LESSON, CLOUDINARY.TYPE.VIDEO),
        lessonModel.findOne({ module: moduleId }).sort({ order: -1 }).select("order").lean()
    ]);

    // Set lesson order
    const order = lastLesson ? lastLesson.order + 1 : 1;

    // Create new lesson
    let lesson = await lessonModel.create({
        module: moduleId,
        title,
        video: {
            url: uplodeData?.url,
            publicId: uplodeData?.public_id,
            hash: uplodeData?.hash
        },
        content,
        order
    });

    // Delete lesson releted cache keys
    await Promise.all([
        deleteCacheByPattern(`lessons:module:${moduleId}`),
        deleteCacheByPattern(`course-full:${module.course._id}:*`),
        deleteCacheByPattern(`progress:*:${module.course._id}`)
    ]);

    // Return data
    return {
        _id: lesson._id,
        module: lesson.module,
        title: lesson.title,
        video: lesson.video?.url,
        content: lesson.content,
        order: lesson.order,
    };
};

export const getLessonsService = async (moduleId) => {

    // Check chche available 
    const cacheKey = `lessons:module:${moduleId}`;
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
        return cachedData;
    };

    // Check valid id
    validateObjectId(moduleId);

    // Parallelize db calls for check module and find lessons
    const [module, lessons] = await Promise.all([
        moduleModel.exists({ _id: moduleId }),
        lessonModel.aggregate([
            { $match: { module: new mongoose.Types.ObjectId(moduleId) } },
            { $sort: { order: 1 } },
            {
                $project: {
                    _id: 1,
                    module: 1,
                    title: 1,
                    video: "$video.url",
                    content: 1,
                    order: 1
                }
            }
        ])
    ]);

    // Check module exist by id
    if (!module) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.MODULE.NOT_FOUND);
    };

    // Set cache
    await setCache(cacheKey, lessons, REDIS_TTL._10M);

    // Return data
    return lessons;
};

export const getLessonService = async (user, lessonId) => {

    // Check valid id
    validateObjectId(lessonId);

    // Fetch lesson by id
    const lesson = await lessonModel.findById(lessonId).select("_id module title video content order").lean();
    if (!lesson) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.LESSON.NOT_FOUND);
    };

    // Check if admin
    if (user.role === ROLES.ADMIN) {
        return {
            ...lesson,
            video: lesson.video?.url
        };
    };

    // Fetch lesson data
    const lessonData = await getInstructorId(lessonId);
    if (!lessonData) {
        throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, MESSAGES.LESSON.CORRUPTED)
    }

    // Check if current lesson instructor
    if (user._id.toString() === lessonData?.instructorId.toString()) {
        return {
            ...lesson,
            video: lesson.video?.url
        };
    }

    // Check user enrolled in this course
    const isEnrolled = await enrollmentModel.exists({ user: user._id, course: lessonData?.courseId });
    if (!isEnrolled) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.ENROLLMENT.REQUIRED)
    };

    // Return data
    return {
        ...lesson,
        video: lesson.video?.url
    };
};

export const updateLessonService = async (data, lessonId, instructorId) => {

    let { videoFile } = data;

    // Check valid id
    validateObjectId(lessonId);

    // Check lesson exist by id
    const lesson = await getInstructorId(lessonId);
    if (!lesson) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.LESSON.NOT_FOUND);
    };

    // Check instructor is owned this lesson
    if (instructorId.toString() !== lesson.instructorId.toString()) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.LESSON.UNAUTHORIZED);
    };

    if (videoFile) {

        const currentVideoHash = crypto.createHash("md5").update(videoFile.buffer).digest("hex");

        // Check is same video
        if (lesson.video?.hash !== currentVideoHash) {

            // Upload new thumbnail while deleting the old one
            const [uploadResult] = await Promise.all([
                uploadToCloudinary(videoFile, CLOUDINARY.FOLDER.LESSON, CLOUDINARY.TYPE.VIDEO),
                lesson.video?.publicId ? deleteFromCloudinary(lesson.video?.publicId, CLOUDINARY.TYPE.VIDEO) : Promise.resolve()
            ]);

            data.video = {
                url: uploadResult.url,
                publicId: uploadResult.public_id,
                hash: uploadResult.hash
            };
        };

        delete data.videoFile;
    };

    // Update lesson
    const updatedLesson = await lessonModel.findByIdAndUpdate(lessonId, data, { returnDocument: "after" })
        .select("_id module title video content order").lean();

    // Delete lesson releted cache keys
    await Promise.all([
        deleteCacheByPattern(`lessons:module:${lesson.moduleId}`),
        deleteCacheByPattern(`course-full:${lesson.courseId}:*`)
    ]);

    // Return data
    return {
        ...updatedLesson,
        video: updatedLesson.video?.url
    };
};

export const deleteLessonService = async (lessonId, instructorId) => {

    // Check valid id
    validateObjectId(lessonId);

    // parallelize fetch lesson and get doubt ids of current lesson
    const [lesson, doubtIds] = await Promise.all([
        getInstructorId(lessonId),
        doubtModel.distinct("_id", { lesson: lessonId })
    ]);

    // Check lesson exist by id
    if (!lesson) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.LESSON.NOT_FOUND);
    };

    // Check instructor is owned this lesson
    if (instructorId.toString() !== lesson.instructorId.toString()) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.LESSON.UNAUTHORIZED);
    };

    // parallelize independent deletes
    await Promise.all([
        deleteCacheByPattern(`lessons:module:${lesson.moduleId}`),
        deleteCacheByPattern(`course-full:${lesson.courseId}:*`),
        deleteCacheByPattern(`progress:*:${lesson.courseId}`),
        replyModel.deleteMany({ doubt: { $in: doubtIds } }),
        doubtModel.deleteMany({ lesson: lessonId }),
        deleteFromCloudinary(lesson.video?.publicId, CLOUDINARY.TYPE.VIDEO),
        lessonModel.deleteOne({ _id: lessonId })
    ]);
};