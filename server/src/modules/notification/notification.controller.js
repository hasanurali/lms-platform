import asyncHandler from "../../utils/asyncHandler.js"
import { getNotificationsService, markAllNotificationsService, markNotificationService } from "./notification.service.js"
import ApiResponse from "../../utils/apiResponse.js"
import { HTTP_STATUS, MESSAGES } from "../../constants/index.js"

export const getNotifications = asyncHandler(async (req, res) => {

    // Get page and limit from request
    const { page, limit } = req.query;

    // Get user id from request
    const userId = req.user._id;

    // Get notifications
    const notifications = await getNotificationsService(userId, page, limit);

    // Send response
    return res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse(MESSAGES.NOTIFICATION.FETCHED_ALL, notifications));
});

export const markAllNotifications = asyncHandler(async (req, res) => {

    // Get user id from request
    const userId = req.user._id;

    // Mark all notification as read
    const notificationCount = await markAllNotificationsService(userId);

    // Send response
    return res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse(MESSAGES.NOTIFICATION.ALL_MARKED_AS_READ, notificationCount));
});

export const markNotification = asyncHandler(async (req, res) => {

    // Get notification id from request
    const notificationId = req.params.id;

    // Get user id from request
    const userId = req.user._id;

    // Mark notification as read by id
    const notification = await markNotificationService(notificationId, userId);

    // Send response
    return res
        .status(HTTP_STATUS.OK)
        .json(new ApiResponse(MESSAGES.NOTIFICATION.MARKED_AS_READ, notification));
});