import express from "express"
const courseRoute = express.Router()
import authMiddleware from "../../middlewares/auth.middleware.js"
import roleMiddleware from "../../middlewares/role.middleware.js"
import { ROLES } from "../../constants/index.js"
import { createCourseValidation } from "./course.validation.js"
import validate from "../../middlewares/validation.result.middleware.js"
import { createCourse, getCourses, getCourse } from "./course.controller.js"

courseRoute.post("/",
    authMiddleware,
    roleMiddleware(ROLES.INSTRUCTOR, ROLES.ADMIN),
    createCourseValidation,
    validate,
    createCourse
);

courseRoute.get("/",
    getCourses
);

courseRoute.get("/:id",
    getCourse
);


export default courseRoute;