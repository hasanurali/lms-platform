import express from "express"
const progressRoute = express.Router()
import authMiddleware from "../../middlewares/auth.middleware.js"
import { getProgress, completeLesson, setLastAccessedLesson } from "./progress.controller.js"

/**
 * @swagger
 * tags:
 *   name: Progress
 *   description: Learning progress — track, complete lessons, and update last accessed lesson
 */

/**
 * @swagger
 * /progress/{courseId}:
 *   get:
 *     summary: Get progress for a course
 *     tags: [Progress]
 *     security:
 *       - cookieAuth: []
 *     description: >
 *       Retrieves the authenticated user's progress for a specific course.
 *       User must be enrolled. If enrolled but no progress record exists yet,
 *       returns a default response with 0% progress instead of a 404.
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Progress fetched successfully (returns default 0% if no progress yet)
 *       400:
 *         description: Invalid course ID format
 *       401:
 *         description: Not authorized or token expired/invalid
 *       403:
 *         description: Must be enrolled in this course to access progress
 *       404:
 *         description: Course not found
 */
progressRoute.get("/:courseId",
    authMiddleware,
    getProgress
);

/**
 * @swagger
 * /progress/complete-lesson:
 *   post:
 *     summary: Mark a lesson as completed
 *     tags: [Progress]
 *     security:
 *       - cookieAuth: []
 *     description: >
 *       Marks a lesson as completed for the authenticated user within a course.
 *       User must be enrolled. If all lessons are completed, the course is
 *       automatically marked as completed and a notification is sent.
 *       Marking an already-completed lesson has no effect.
 *       If the course is already completed, existing progress is returned immediately.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - course
 *               - lesson
 *             properties:
 *               course:
 *                 type: string
 *                 example: 64f1a2b3c4d5e6f7a8b9c0d1
 *               lesson:
 *                 type: string
 *                 example: 64f1a2b3c4d5e6f7a8b9c0d2
 *     responses:
 *       200:
 *         description: Progress updated successfully (or Course completed successfully if all lessons done)
 *       400:
 *         description: Validation error or lesson does not belong to the course
 *       401:
 *         description: Not authorized or token expired/invalid
 *       403:
 *         description: Must be enrolled in this course
 *       404:
 *         description: Course not found
 */
progressRoute.post("/complete-lesson",
    authMiddleware,
    completeLesson
);

/**
 * @swagger
 * /progress/last-lesson:
 *   post:
 *     summary: Set the last accessed lesson
 *     tags: [Progress]
 *     security:
 *       - cookieAuth: []
 *     description: >
 *       Updates the last accessed lesson for the authenticated user within a course.
 *       User must be enrolled. Creates a progress record if one does not exist yet.
 *       Does not affect completed lessons or completion status.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - course
 *               - lesson
 *             properties:
 *               course:
 *                 type: string
 *                 example: 64f1a2b3c4d5e6f7a8b9c0d1
 *               lesson:
 *                 type: string
 *                 example: 64f1a2b3c4d5e6f7a8b9c0d2
 *     responses:
 *       200:
 *         description: Progress updated successfully
 *       400:
 *         description: Validation error or lesson does not belong to the course
 *       401:
 *         description: Not authorized or token expired/invalid
 *       403:
 *         description: Must be enrolled in this course
 *       404:
 *         description: Course not found
 */
progressRoute.post("/last-lesson",
    authMiddleware,
    setLastAccessedLesson
);


export default progressRoute;