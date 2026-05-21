import express from "express"
const notificationRoute = express.Router()
import authMiddleware from "../../middlewares/auth.middleware.js"
import { getNotifications, markAllNotifications, markNotification } from "./notification.controller.js"

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification management — retrieve and mark notifications as read
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get all notifications for the authenticated user
 *     tags: [Notifications]
 *     security:
 *       - cookieAuth: []
 *     description: >
 *       Retrieves the authenticated user's notifications with pagination,
 *       sorted by most recent first.
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
 *         description: Notifications fetched successfully with pagination
 *       401:
 *         description: Not authorized or token expired/invalid
 */
notificationRoute.get("/",
    authMiddleware,
    getNotifications
);

/**
 * @swagger
 * /notifications/read-all:
 *   put:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - cookieAuth: []
 *     description: >
 *       Marks all unread notifications for the authenticated user as read.
 *       Returns the count of notifications that were updated.
 *     responses:
 *       200:
 *         description: All notifications marked as read successfully — returns modifiedCount
 *       401:
 *         description: Not authorized or token expired/invalid
 */
notificationRoute.put("/read-all",
    authMiddleware,
    markAllNotifications
);

/**
 * @swagger
 * /notifications/{id}/read:
 *   put:
 *     summary: Mark a single notification as read
 *     tags: [Notifications]
 *     security:
 *       - cookieAuth: []
 *     description: Marks a single notification as read by its ID. Only the notification owner can do this.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read successfully
 *       400:
 *         description: Invalid notification ID format
 *       401:
 *         description: Not authorized or token expired/invalid
 *       403:
 *         description: Not authorized to modify this notification
 *       404:
 *         description: Notification not found
 */
notificationRoute.put("/:id/read",
    authMiddleware,
    markNotification
);


export default notificationRoute;