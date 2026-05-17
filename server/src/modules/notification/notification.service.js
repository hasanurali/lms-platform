import notificationModel from "./notification.model.js";
import ApiError from "../../utils/apiError.js";
import { HTTP_STATUS, MESSAGES } from "../../constants/index.js";
import validateObjectId from "../../utils/validateObjectId.js";


export const createNotificationService = async (data) => {
    return await notificationModel.create(data);
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