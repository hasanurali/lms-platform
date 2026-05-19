import notificationModel from "./notification.model.js";
import userModel from "../user/user.model.js"
import ApiError from "../../utils/apiError.js";
import { HTTP_STATUS, MESSAGES, SOCKET_EVENTS } from "../../constants/index.js";
import validateObjectId from "../../utils/validateObjectId.js";
import { getIO } from "../../socket/socket.js"


export const createNotificationService = async (data) => {

    // Create notification
    const notification = await notificationModel.create(data);

    // Send notification to user
    const io = getIO();
    io.to(`user:${notification.user.toString()}`).emit(SOCKET_EVENTS.NEW_NOTIFICATION, {
        _id: notification._id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        isRead: notification.isRead,
        metadata: notification.metadata,
        createdAt: notification.createdAt
    });

    return notification;
};

export const createGlobalNotificationService = async (data) => {

    const { exceptUser, title, message, type, metadata = {} } = data;

    const users = await userModel.find(exceptUser ? { _id: { $ne: exceptUser } } : {}).select("_id").lean();

    const notifications = users.map((user) => ({
        user: user._id,
        title,
        message,
        type,
        metadata
    }));

    // Insert all notifications
    const insertedNotifications = await notificationModel.insertMany(notifications);

    // Use the first inserted notification as the payload template(all are same except user field)
    const notification = insertedNotifications[0]

    // Send notification to user
    const io = getIO();
    io.to("global").except(`user:${exceptUser.toString()}`).emit(SOCKET_EVENTS.NEW_NOTIFICATION, {
        _id: notification._id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        isRead: notification.isRead,
        metadata: notification.metadata,
        createdAt: notification.createdAt
    });

    return insertedNotifications;
};

export const getNotificationsService = async (userId, page, limit) => {

    // Calculate page and limit
    const safePage = Math.max(parseInt(page) || 1, 1);
    const safeLimit = Math.min(Math.max(parseInt(limit) || 10, 1), 50);

    // Calculate skip
    const skip = (safePage - 1) * safeLimit;

    // Fetch notifications
    const result = await notificationModel.aggregate([
        { $match: { user: userId } },
        {
            $facet: {
                data: [
                    { $sort: { createdAt: -1 } },
                    { $skip: skip },
                    { $limit: safeLimit },
                    {
                        $project: {
                            _id: 1,
                            title: 1,
                            message: 1,
                            type: 1,
                            isRead: 1,
                            metadata: 1,
                            createdAt: 1
                        }
                    }
                ],
                total: [{ $count: "count" }]
            }
        }
    ]);

    const notifications = result[0].data;
    const total = result[0].total[0]?.count || 0;

    // Return data
    return {
        data: notifications,
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

export const markAllNotificationsService = async (userId) => {

    // Mark all user notifications as read 
    const result = await notificationModel.updateMany({ user: userId, isRead: false }, { $set: { isRead: true } });

    // Return updated notifications count
    return {
        modifiedCount: result?.modifiedCount
    };
};

export const markNotificationService = async (notificationId, userId) => {

    // Validate id
    validateObjectId(notificationId)

    // Check notification exists
    const notification = await notificationModel.findById(notificationId).select("user").lean()
    if (!notification) {
        throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.NOTIFICATION.NOT_FOUND)
    };

    // Check authorization
    if (notification.user.toString() !== userId.toString()) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, MESSAGES.NOTIFICATION.UNAUTHORIZED)
    };

    // Update notification
    const updatedNotification = await notificationModel.findByIdAndUpdate(notificationId, { isRead: true }, { returnDocument: "after" })
        .select("_id title message type isRead metadata createdAt").lean();

    // Return data
    return updatedNotification
};