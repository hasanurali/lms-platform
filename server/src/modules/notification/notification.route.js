import express from "express"
const notificationRoute = express.Router()
import authMiddleware from "../../middlewares/auth.middleware.js"
import { getNotifications, markAllNotifications, markNotification } from "./notification.controller.js"


notificationRoute.get("/",
    authMiddleware,
    getNotifications
);

notificationRoute.put("/read-all",
    authMiddleware,
    markAllNotifications
);

notificationRoute.put("/:id/read",
    authMiddleware,
    markNotification
);


export default notificationRoute;