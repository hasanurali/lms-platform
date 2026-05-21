import express from "express"
const lessonRoute = express.Router()
import authMiddleware from "../../middlewares/auth.middleware.js"
import roleMiddleware from "../../middlewares/role.middleware.js"
import { ROLES } from "../../constants/index.js"
import { createLessonValidation, updateLessonValidation } from "./lesson.validation.js"
import validate from "../../middlewares/validation.result.middleware.js"
import { createLesson, getLessons, getLesson, updatelesson, deleteLesson } from "./lesson.controller.js"
import multerVideoMiddleware from "../../middlewares/multerVideo.middleware.js"

/**
 * @swagger
 * tags:
 *   name: Lessons
 *   description: Lesson management — create, retrieve, update, and delete lessons within a module
 */

/**
 * @swagger
 * /modules/{id}/lessons:
 *   post:
 *     summary: Create a new lesson
 *     tags: [Lessons]
 *     security:
 *       - cookieAuth: []
 *     description: >
 *       Creates a new lesson under the specified module. The video must be uploaded
 *       as a file. The order field is assigned automatically — first lesson gets
 *       order 1, each subsequent lesson increments by 1.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - video
 *             properties:
 *               title:
 *                 type: string
 *                 example: What is JavaScript?
 *               video:
 *                 type: string
 *                 format: binary
 *               content:
 *                 type: string
 *                 example: In this lesson we cover the basics of JavaScript.
 *     responses:
 *       201:
 *         description: Lesson created successfully
 *       400:
 *         description: Validation error or invalid module ID
 *       401:
 *         description: Not authorized or token expired/invalid
 *       403:
 *         description: Access denied or not the course owner
 *       404:
 *         description: Module not found
 */
lessonRoute.post("/modules/:id/lessons",
    authMiddleware,
    roleMiddleware(ROLES.INSTRUCTOR, ROLES.ADMIN),
    multerVideoMiddleware.single("video"),
    createLessonValidation,
    validate,
    createLesson
);

/**
 * @swagger
 * /modules/{id}/lessons:
 *   get:
 *     summary: Get all lessons for a module
 *     tags: [Lessons]
 *     description: Retrieves all lessons for the specified module, sorted by order ascending.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *     responses:
 *       200:
 *         description: Lessons fetched successfully
 *       400:
 *         description: Invalid module ID format
 *       404:
 *         description: Module not found
 */
lessonRoute.get("/modules/:id/lessons",
    getLessons
);

/**
 * @swagger
 * /lessons/{id}:
 *   get:
 *     summary: Get a lesson by ID
 *     tags: [Lessons]
 *     security:
 *       - cookieAuth: []
 *     description: >
 *       Retrieves a single lesson by its ID. Access is granted to admins and the
 *       course instructor without an enrollment check. All other authenticated
 *       users must be enrolled in the course.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lesson ID
 *     responses:
 *       200:
 *         description: Lesson fetched successfully
 *       400:
 *         description: Invalid lesson ID format
 *       401:
 *         description: Not authorized or token expired/invalid
 *       403:
 *         description: Must be enrolled in the course to access this content
 *       404:
 *         description: Lesson not found
 *       500:
 *         description: Lesson data is corrupted
 */
lessonRoute.get("/lessons/:id",
    authMiddleware,
    getLesson
);

/**
 * @swagger
 * /lessons/{id}:
 *   put:
 *     summary: Update a lesson
 *     tags: [Lessons]
 *     security:
 *       - cookieAuth: []
 *     description: >
 *       Updates lesson fields. Only provided fields are updated.
 *       If a new video is uploaded and differs from the existing one (checked by MD5 hash),
 *       the old video is deleted from Cloudinary and replaced. Order cannot be changed.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lesson ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Lesson Title
 *               video:
 *                 type: string
 *                 format: binary
 *               content:
 *                 type: string
 *                 example: Updated content here.
 *     responses:
 *       200:
 *         description: Lesson updated successfully
 *       400:
 *         description: Validation error or invalid lesson ID
 *       401:
 *         description: Not authorized or token expired/invalid
 *       403:
 *         description: Access denied or not the course owner
 *       404:
 *         description: Lesson not found
 */
lessonRoute.put("/lessons/:id",
    authMiddleware,
    roleMiddleware(ROLES.INSTRUCTOR, ROLES.ADMIN),
    multerVideoMiddleware.single("video"),
    updateLessonValidation,
    validate,
    updatelesson
);

/**
 * @swagger
 * /lessons/{id}:
 *   delete:
 *     summary: Delete a lesson
 *     tags: [Lessons]
 *     security:
 *       - cookieAuth: []
 *     description: >
 *       Permanently deletes a lesson, its video from Cloudinary,
 *       and all associated doubts and replies.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lesson ID
 *     responses:
 *       200:
 *         description: Lesson deleted successfully
 *       400:
 *         description: Invalid lesson ID format
 *       401:
 *         description: Not authorized or token expired/invalid
 *       403:
 *         description: Access denied or not the course owner
 *       404:
 *         description: Lesson not found
 */
lessonRoute.delete("/lessons/:id",
    authMiddleware,
    roleMiddleware(ROLES.INSTRUCTOR, ROLES.ADMIN),
    deleteLesson
);

export default lessonRoute;