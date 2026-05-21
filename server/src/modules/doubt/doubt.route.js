import express from "express"
const doubtRoute = express.Router()
import authMiddleware from "../../middlewares/auth.middleware.js"
import roleMiddleware from "../../middlewares/role.middleware.js"
import { createDoubtValidation, createReplyValidation } from "./doubt.validation.js"
import validate from "../../middlewares/validation.result.middleware.js"
import { createDoubt, getLessonDoubts, getMyDoubts, getCourseDoubts, getDoubtDetails, replyToDoubt, markDoubtAnswered, closeDoubt } from "./doubt.controller.js"
import { ROLES } from "../../constants/index.js"

/**
 * @swagger
 * tags:
 *   name: Doubts
 *   description: Doubt management — ask, reply, and manage lesson doubts
 */

/**
 * @swagger
 * /doubts:
 *   post:
 *     summary: Create a new doubt
 *     tags: [Doubts]
 *     security:
 *       - cookieAuth: []
 *     description: >
 *       Creates a new doubt for a specific lesson within a course.
 *       The description is stored as the first reply.
 *       Access is granted to admins and the course instructor without enrollment check.
 *       All other users must be enrolled in the course.
 *       A notification is sent to the course instructor on creation.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - course
 *               - lesson
 *               - title
 *               - description
 *             properties:
 *               course:
 *                 type: string
 *                 example: 64f1a2b3c4d5e6f7a8b9c0d1
 *               lesson:
 *                 type: string
 *                 example: 64f1a2b3c4d5e6f7a8b9c0d2
 *               title:
 *                 type: string
 *                 example: What is a closure?
 *               description:
 *                 type: string
 *                 example: I don't understand how closures work in JavaScript.
 *     responses:
 *       201:
 *         description: Doubt created successfully — returns doubt and first reply
 *       400:
 *         description: Validation error or lesson does not belong to the course
 *       401:
 *         description: Not authorized or token expired/invalid
 *       403:
 *         description: User not enrolled in the course
 *       404:
 *         description: Course or lesson not found
 */
doubtRoute.post("/doubts",
    authMiddleware,
    createDoubtValidation,
    validate,
    createDoubt
);

/**
 * @swagger
 * /lessons/{id}/doubts:
 *   get:
 *     summary: Get all doubts for a lesson
 *     tags: [Doubts]
 *     security:
 *       - cookieAuth: []
 *     description: Retrieves all doubts for a specific lesson, sorted by most recently active.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Lesson ID
 *     responses:
 *       200:
 *         description: Doubts fetched successfully
 *       400:
 *         description: Invalid lesson ID format
 *       401:
 *         description: Not authorized or token expired/invalid
 *       404:
 *         description: Lesson not found
 */
doubtRoute.get("/lessons/:id/doubts",
    authMiddleware,
    getLessonDoubts
);

/**
 * @swagger
 * /doubts/my:
 *   get:
 *     summary: Get doubts created by the authenticated user
 *     tags: [Doubts]
 *     security:
 *       - cookieAuth: []
 *     description: >
 *       Retrieves all doubts created by the authenticated user,
 *       sorted by most recently active. Returns an empty array if none exist.
 *     responses:
 *       200:
 *         description: Doubts fetched successfully
 *       401:
 *         description: Not authorized or token expired/invalid
 */
doubtRoute.get("/doubts/my",
    authMiddleware,
    getMyDoubts
);

/**
 * @swagger
 * /courses/{id}/doubts:
 *   get:
 *     summary: Get all doubts for a course
 *     tags: [Doubts]
 *     security:
 *       - cookieAuth: []
 *     description: >
 *       Retrieves all doubts for a specific course with pagination.
 *       Only the course instructor and admins can access this endpoint.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
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
 *         description: Doubts fetched successfully with pagination
 *       400:
 *         description: Invalid course ID format
 *       401:
 *         description: Not authorized or token expired/invalid
 *       403:
 *         description: Access denied or not the course instructor
 *       404:
 *         description: Course not found
 */
doubtRoute.get("/courses/:id/doubts",
    authMiddleware,
    roleMiddleware(ROLES.ADMIN, ROLES.INSTRUCTOR),
    getCourseDoubts
);

/**
 * @swagger
 * /doubts/{id}:
 *   get:
 *     summary: Get doubt details with all replies
 *     tags: [Doubts]
 *     security:
 *       - cookieAuth: []
 *     description: Retrieves a single doubt with all its replies sorted oldest first.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doubt ID
 *     responses:
 *       200:
 *         description: Doubt fetched successfully with replies
 *       400:
 *         description: Invalid doubt ID format
 *       401:
 *         description: Not authorized or token expired/invalid
 *       404:
 *         description: Doubt not found
 */
doubtRoute.get("/doubts/:id",
    authMiddleware,
    getDoubtDetails
);

/**
 * @swagger
 * /doubts/{id}/replies:
 *   post:
 *     summary: Add a reply to a doubt
 *     tags: [Doubts]
 *     security:
 *       - cookieAuth: []
 *     description: >
 *       Adds a reply to an existing doubt. Allowed for the admin, course instructor,
 *       or the student who created the doubt. Replies are not allowed on closed doubts.
 *       A notification is sent to the student when someone else replies.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doubt ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 example: A closure is a function that retains access to its outer scope.
 *     responses:
 *       201:
 *         description: Reply added successfully
 *       400:
 *         description: Validation error or doubt is already closed
 *       401:
 *         description: Not authorized or token expired/invalid
 *       403:
 *         description: Not the admin, course instructor, or doubt's student
 *       404:
 *         description: Doubt not found
 */
doubtRoute.post("/doubts/:id/replies",
    authMiddleware,
    createReplyValidation,
    validate,
    replyToDoubt
);

/**
 * @swagger
 * /doubts/{id}/mark-answered:
 *   put:
 *     summary: Mark a doubt as answered
 *     tags: [Doubts]
 *     security:
 *       - cookieAuth: []
 *     description: >
 *       Marks a doubt as answered. Only the course instructor or admin can do this.
 *       Cannot be applied to doubts already answered or closed.
 *       A notification is sent to the student when their doubt is marked answered.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doubt ID
 *     responses:
 *       200:
 *         description: Doubt marked as answered successfully
 *       400:
 *         description: Invalid ID, doubt already closed, or already answered
 *       401:
 *         description: Not authorized or token expired/invalid
 *       403:
 *         description: Access denied or not the course instructor
 *       404:
 *         description: Doubt not found
 */
doubtRoute.put("/doubts/:id/mark-answered",
    authMiddleware,
    roleMiddleware(ROLES.ADMIN, ROLES.INSTRUCTOR),
    markDoubtAnswered
);

/**
 * @swagger
 * /doubts/{id}/close:
 *   put:
 *     summary: Close a doubt
 *     tags: [Doubts]
 *     security:
 *       - cookieAuth: []
 *     description: >
 *       Closes a doubt permanently. Only the student who created the doubt can close it.
 *       Once closed, no further replies or status changes are allowed.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doubt ID
 *     responses:
 *       200:
 *         description: Doubt closed successfully
 *       400:
 *         description: Invalid ID or doubt already closed
 *       401:
 *         description: Not authorized or token expired/invalid
 *       403:
 *         description: Only the student who created this doubt can close it
 *       404:
 *         description: Doubt not found
 */
doubtRoute.put("/doubts/:id/close",
    authMiddleware,
    closeDoubt
);


export default doubtRoute;