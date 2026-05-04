import express from "express"
const lessonRoute = express.Router()
import authMiddleware from "../../middlewares/auth.middleware.js"
import roleMiddleware from "../../middlewares/role.middleware.js"
import { ROLES } from "../../constants/index.js"
import { createLessonValidation } from "./lesson.validation.js"
import validate from "../../middlewares/validation.result.middleware.js"
import { createLesson, getLessons } from "./lesson.controller.js"

lessonRoute.post("/modules/:id/lessons",
    authMiddleware,
    roleMiddleware(ROLES.INSTRUCTOR, ROLES.ADMIN),
    createLessonValidation,
    validate,
    createLesson
);

lessonRoute.get("/modules/:id/lessons",
    authMiddleware,
    getLessons
);

export default lessonRoute;