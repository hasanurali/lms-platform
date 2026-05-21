import express from "express"
const reviewRoute = express.Router()
import authMiddleware from "../../middlewares/auth.middleware.js"
import { createReviewValidation, updateReviewValidation } from "./review.validation.js"
import validate from "../../middlewares/validation.result.middleware.js"
import { createReview, getReviews, updateReview, deleteReview } from "./review.controller.js"

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Course reviews — submit, retrieve, update, and delete reviews
 */

/**
 * @swagger
 * /courses/{id}/reviews:
 *   post:
 *     summary: Submit a review for a course
 *     tags: [Reviews]
 *     security:
 *       - cookieAuth: []
 *     description: >
 *       Submits a review for a course. The student must be enrolled and must not
 *       have already reviewed the course. The course instructor cannot review
 *       their own course. A notification is sent to the instructor on submission.
 *       Course averageRating, totalReviews, and ratingDistribution are recalculated automatically.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - message
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               message:
 *                 type: string
 *                 example: This course is excellent! Very well explained.
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Validation error or invalid course ID
 *       401:
 *         description: Not authorized or token expired/invalid
 *       403:
 *         description: Instructor cannot review their own course, or user not enrolled
 *       404:
 *         description: Course not found
 *       409:
 *         description: Already reviewed this course
 */
reviewRoute.post("/courses/:id/reviews",
    authMiddleware,
    createReviewValidation,
    validate,
    createReview
);

/**
 * @swagger
 * /courses/{id}/reviews:
 *   get:
 *     summary: Get all reviews for a course
 *     tags: [Reviews]
 *     description: Retrieves all reviews for a specific course with pagination, sorted by rating descending.
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
 *         description: Reviews fetched successfully with pagination
 *       400:
 *         description: Invalid course ID format
 *       404:
 *         description: Course not found
 */
reviewRoute.get("/courses/:id/reviews",
    getReviews
);

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Update a review
 *     tags: [Reviews]
 *     security:
 *       - cookieAuth: []
 *     description: >
 *       Updates the authenticated student's review. Only provided fields are updated.
 *       Only the student who created the review can update it.
 *       Course rating is recalculated automatically after update.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *               message:
 *                 type: string
 *                 example: Updated review message here.
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       400:
 *         description: Validation error or invalid review ID
 *       401:
 *         description: Not authorized or token expired/invalid
 *       403:
 *         description: Not authorized to modify this review
 *       404:
 *         description: Review not found
 */
reviewRoute.put("/reviews/:id",
    authMiddleware,
    updateReviewValidation,
    validate,
    updateReview
);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     security:
 *       - cookieAuth: []
 *     description: >
 *       Permanently deletes the authenticated student's review.
 *       Only the student who created the review can delete it.
 *       Course rating is recalculated automatically after deletion.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       400:
 *         description: Invalid review ID format
 *       401:
 *         description: Not authorized or token expired/invalid
 *       403:
 *         description: Not authorized to modify this review
 *       404:
 *         description: Review not found
 */
reviewRoute.delete("/reviews/:id",
    authMiddleware,
    deleteReview
);

export default reviewRoute;