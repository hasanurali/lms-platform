import express from "express"
const enrollmentRoute = express.Router()
import authMiddleware from "../../middlewares/auth.middleware.js"
import { createEnrollment, getEnrollments } from "./enrollment.controller.js"

/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: Course enrollment — enroll in courses and retrieve enrolled courses
 */

/**
 * @swagger
 * /courses/{id}/enroll:
 *   post:
 *     summary: Enroll in a course
 *     tags: [Enrollments]
 *     security:
 *       - cookieAuth: []
 *     description: >
 *       Enrolls the authenticated user in the specified course.
 *       Any authenticated user can enroll regardless of role.
 *       A user can only enroll in the same course once.
 *       A welcome notification is sent to the user upon successful enrollment.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       201:
 *         description: Successfully enrolled in the course
 *       400:
 *         description: Invalid course ID format
 *       401:
 *         description: Not authorized or token expired/invalid
 *       404:
 *         description: Course not found
 *       409:
 *         description: Already enrolled in this course
 */
enrollmentRoute.post("/courses/:id/enroll",
    authMiddleware,
    createEnrollment
);

/**
 * @swagger
 * /enrollments/my:
 *   get:
 *     summary: Get all courses the authenticated user is enrolled in
 *     tags: [Enrollments]
 *     security:
 *       - cookieAuth: []
 *     description: >
 *       Retrieves all courses the authenticated user is enrolled in.
 *       Returns an empty array if the user has no enrollments.
 *     responses:
 *       200:
 *         description: Enrolled courses fetched successfully
 *       401:
 *         description: Not authorized or token expired/invalid
 */
enrollmentRoute.get("/enrollments/my",
    authMiddleware,
    getEnrollments
);

export default enrollmentRoute;