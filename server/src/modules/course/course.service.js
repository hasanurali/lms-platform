import courseModel from "./course.model.js"
import moduleModel from "../module/module.model.js"
import lessonModel from "../lesson/lesson.model.js"
import progressModel from "../progress/progress.model.js"
import enrollmentModel from "../enrollment/enrollment.model.js"
import doubtModel from "../doubt/doubt.model.js"
import replyModel from "../doubt/reply.model.js"
import ApiError from "../../utils/apiError.js";
import { HTTP_STATUS, MESSAGES, CLOUDINARY } from "../../constants/index.js";
import validateObjectId from "../../utils/validateObjectId.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../../utils/Cloudinary.js"
import crypto from "crypto";


// Common population for instructor
const commonPopulate = {
    path: "instructor",
    select: "name email profilePicture.url"
};

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

    // Get populated instructor data with course
    const populatedData = await courseModel.findById(course._id).populate(commonPopulate)

    // Return data
    return populatedData;
};

export const getCoursesService = async (page = 1, limit = 10) => {

    // Calculate page and limit
    const safePage = Math.max(parseInt(page) || 1, 1);
    const safeLimit = Math.min(Math.max(parseInt(limit) || 10, 1), 50);

    // Calculate skip
    const skip = (safePage - 1) * safeLimit;

    // Fetch courses
    const courses = await courseModel.find({ isPublished: true })
        .skip(skip)
        .limit(safeLimit)
        .sort({ createdAt: -1 })
        .populate(commonPopulate);

    // Total count for pagination
    const total = await courseModel.countDocuments({ isPublished: true });

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

export const getMyCoursesService = async (instructorId) => {

    // Get courses created by the authenticated instructor
    const courses = await courseModel.find({ instructor: instructorId })
        .populate(commonPopulate)
        .sort({ createdAt: -1 });

    // Return data
    return courses;
};

export const getFullCourseService = async (courseId, userId) => {

    // Validate ID
    validateObjectId(courseId);

    // Fetch course
    const course = await courseModel.findById(courseId).populate(commonPopulate);
    if (!course) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.COURSE.NOT_FOUND);
    }

    // Get modules
    const modules = await moduleModel.find({ course: courseId }).sort({ order: 1 }).lean();
    const moduleIds = modules.map(m => m._id);

    // Get lessons
    const lessons = await lessonModel.find({ module: { $in: moduleIds } }).select("-video.publicId -video.hash").sort({ order: 1 }).lean();

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

    // Get progress (optional if not logged in)
    let progress = null;
    if (userId) {
        progress = await progressModel.findOne({ user: userId, course: courseId });
    };

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

    // Return data
    return {
        course,
        modules: modulesWithLessons,
        progress: {
            percentage: progressPercentage,
            completed: progress?.completed || false,
            lastAccessLesson: progress?.lastAccessLesson || null
        }
    };
};

export const getCourseService = async (courseId) => {

    // Check valid id
    validateObjectId(courseId);

    // Fetch course by id
    const course = await courseModel.findById(courseId).populate(commonPopulate);
    if (!course) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.COURSE.NOT_FOUND);
    };

    // Return data
    return course;
};

export const updateCourseService = async (data, instructorId, courseId) => {

    const { thumbnailFile } = data;

    // Check valid id
    validateObjectId(courseId);

    // Fetch course by id
    const course = await courseModel.findById(courseId);
    if (!course) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.COURSE.NOT_FOUND);
    };

    // Check instructor is owned this course
    if (instructorId.toString() !== course.instructor.toString()) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.COURSE.UNAUTHORIZED);
    };


    if (thumbnailFile) {

        const course = await courseModel.findById(courseId).select("thumbnail");
        const currentThumbnailHash = crypto.createHash("md5").update(thumbnailFile.buffer).digest("hex");

        // Check if same thumbnail
        if (course.thumbnail.hash !== currentThumbnailHash) {

            // Delete thumbnail from cloudinary
            await deleteFromCloudinary(course.thumbnail.publicId)

            // Uplode thumbnail to cloudinary
            const { url, public_id, hash } = await uploadToCloudinary(thumbnailFile, CLOUDINARY.FOLDER.THUMBNAIL);
            data.thumbnail = {
                url,
                publicId: public_id,
                hash
            }
        }

        delete data.thumbnailFile;
    };

    // Update course
    const updatedCourse = await courseModel.findByIdAndUpdate(courseId, data, { returnDocument: "after" })
        .populate(commonPopulate);

    // Return data
    return updatedCourse;
};

export const deleteCourseService = async (instructorId, courseId) => {

    // Check valid id
    validateObjectId(courseId);

    // Fetch course by id
    const course = await courseModel.findById(courseId);
    if (!course) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.COURSE.NOT_FOUND);
    };

    // Check instructor is owned this course
    if (instructorId.toString() !== course.instructor.toString()) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.COURSE.UNAUTHORIZED);
    };

    // Delete progress and enrollment of this course
    await progressModel.deleteMany({ course: courseId });
    await enrollmentModel.deleteMany({ course: courseId });

    // Get all module ids of this course
    const moduleIds = await moduleModel.distinct("_id", { course: courseId });

    // Get all lessons of those modules
    const lessons = await lessonModel.find({ module: { $in: moduleIds } }).select("video.publicId -_id");

    // Delete all lesson videos from cloudinary
    if (lessons.length > 0) {
        const deletePromises = lessons.map(({ video }) =>
            deleteFromCloudinary(video.publicId, CLOUDINARY.TYPE.VIDEO)
        );
        await Promise.all(deletePromises);
    };

    // Delete lessons of those modules
    await lessonModel.deleteMany({ module: { $in: moduleIds } });

    // Delete all modules of this course
    await moduleModel.deleteMany({ course: courseId })

    // Delete thumbnail from cloudinary
    await deleteFromCloudinary(course.thumbnail.publicId)

    // Get all doubt ids of this course
    const doubtIds = await doubtModel.distinct("_id", { course: courseId });

    // Delete all replies of those doubts
    await replyModel.deleteMany({
        doubt: { $in: doubtIds }
    });

    // Delete all doubts
    await doubtModel.deleteMany({
        course: courseId
    });

    // Delete course
    await courseModel.deleteOne({ _id: courseId });
};