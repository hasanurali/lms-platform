import express from "express"
const courseRoute = express.Router()
import authMiddleware from "../../middlewares/auth.middleware.js"
import roleMiddleware from "../../middlewares/role.middleware.js"
import { ROLES } from "../../constants/index.js"
import { createCourseValidation, updateCourseValidation } from "./course.validation.js"
import validate from "../../middlewares/validation.result.middleware.js"
import { createCourse, getCourses, getMyCourses, getFullCourse, getCourse, updateCourse, deleteCourse } from "./course.controller.js"
import optionalMiddleware from "../../middlewares/optional.middleware.js"
import multerImageMiddleware from "../../middlewares/multerImage.middleware.js"

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management — create, retrieve, update, and delete courses
 */

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - cookieAuth: []
 *     description: >
 *       Creates a new course. Thumbnail must be uploaded as a file.
 *       Only instructors and admins can create courses.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - thumbnail
 *             properties:
 *               title:
 *                 type: string
 *                 example: Introduction to JavaScript
 *               description:
 *                 type: string
 *                 example: Learn JavaScript from basics to advanced
 *               price:
 *                 type: number
 *                 example: 49.99
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Validation error (title / description / price / thumbnail)
 *       401:
 *         description: Not authorized or token expired/invalid
 *       403:
 *         description: Access denied — INSTRUCTOR or ADMIN role required
 */
courseRoute.post("/",
    authMiddleware,
    roleMiddleware(ROLES.INSTRUCTOR, ROLES.ADMIN),
    multerImageMiddleware.single("thumbnail"),
    createCourseValidation,
    validate,
    createCourse
);

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all published courses
 *     tags: [Courses]
 *     description: Retrieves all published courses with pagination support.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number (min 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Results per page (min 1, max 50)
 *     responses:
 *       200:
 *         description: Courses fetched successfully with pagination
 */
courseRoute.get("/",
    getCourses
);

/**
 * @swagger
 * /courses/my:
 *   get:
 *     summary: Get courses created by the authenticated instructor
 *     tags: [Courses]
 *     security:
 *       - cookieAuth: []
 *     description: >
 *       Retrieves all courses created by the authenticated instructor or admin,
 *       including unpublished ones. Sorted by most recently created.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Courses fetched successfully with pagination
 *       401:
 *         description: Not authorized or token expired/invalid
 *       403:
 *         description: Access denied — INSTRUCTOR or ADMIN role required
 */
courseRoute.get("/my",
    authMiddleware,
    roleMiddleware(ROLES.INSTRUCTOR, ROLES.ADMIN),
    getMyCourses
);

/**
 * @swagger
 * /courses/{id}/full:
 *   get:
 *     summary: Get full course with modules and lessons
 *     tags: [Courses]
 *     description: >
 *       Retrieves a course with all modules and nested lessons.
 *       If authenticated, each lesson includes a `completed` boolean based on
 *       user progress. Invalid or expired tokens are silently ignored and the
 *       request is treated as unauthenticated.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course fetched successfully with modules, lessons, and progress
 *       400:
 *         description: Invalid course ID format
 *       404:
 *         description: Course not found
 */
courseRoute.get("/:id/full",
    optionalMiddleware,
    getFullCourse
);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course fetched successfully
 *       400:
 *         description: Invalid course ID format
 *       404:
 *         description: Course not found
 */
courseRoute.get("/:id",
    getCourse
);

/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Update a course
 *     tags: [Courses]
 *     security:
 *       - cookieAuth: []
 *     description: >
 *       Updates course details. Only provided fields are updated.
 *       If a new thumbnail is uploaded, the old one is deleted from Cloudinary.
 *       A global notification is sent to all users when a course is published for the first time.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Introduction to JavaScript
 *               description:
 *                 type: string
 *                 example: Learn JavaScript from basics to advanced
 *               price:
 *                 type: number
 *                 example: 49.99
 *               isPublished:
 *                 type: boolean
 *                 example: true
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Course updated successfully (or published successfully if isPublished is true)
 *       400:
 *         description: Validation error or invalid course ID
 *       401:
 *         description: Not authorized or token expired/invalid
 *       403:
 *         description: Access denied or not the course owner
 *       404:
 *         description: Course not found
 */
courseRoute.put("/:id",
    authMiddleware,
    roleMiddleware(ROLES.INSTRUCTOR, ROLES.ADMIN),
    multerImageMiddleware.single("thumbnail"),
    updateCourseValidation,
    validate,
    updateCourse
);

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     security:
 *       - cookieAuth: []
 *     description: >
 *       Permanently deletes a course and all associated data — modules, lessons,
 *       videos from Cloudinary, enrollments, progress records, doubts, replies,
 *       and the course thumbnail from Cloudinary.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       400:
 *         description: Invalid course ID format
 *       401:
 *         description: Not authorized or token expired/invalid
 *       403:
 *         description: Access denied or not the course owner
 *       404:
 *         description: Course not found
 */
courseRoute.delete("/:id",
    authMiddleware,
    roleMiddleware(ROLES.INSTRUCTOR, ROLES.ADMIN),
    deleteCourse
);

export default courseRoute;