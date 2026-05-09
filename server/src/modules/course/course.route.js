import express from "express"
const courseRoute = express.Router()
import authMiddleware from "../../middlewares/auth.middleware.js"
import roleMiddleware from "../../middlewares/role.middleware.js"
import { ROLES } from "../../constants/index.js"
import { createCourseValidation, updateCourseValidation } from "./course.validation.js"
import validate from "../../middlewares/validation.result.middleware.js"
import { createCourse, getCourses, getFullCourse, getCourse, updateCourse, deleteCourse } from "./course.controller.js"
import optionalMiddleware from "../../middlewares/optional.middleware.js"
import multerImageMiddleware from "../../middlewares/multerImage.middleware.js"

courseRoute.post("/",
    authMiddleware,
    roleMiddleware(ROLES.INSTRUCTOR, ROLES.ADMIN),
    multerImageMiddleware.single("thumbnail"),
    createCourseValidation,
    validate,
    createCourse
);

courseRoute.get("/",
    getCourses
);

courseRoute.get("/:id/full",
    optionalMiddleware,
    getFullCourse
);

courseRoute.get("/:id",
    getCourse
);

courseRoute.put("/:id",
    authMiddleware,
    roleMiddleware(ROLES.INSTRUCTOR, ROLES.ADMIN),
    multerImageMiddleware.single("thumbnail"),
    updateCourseValidation,
    validate,
    updateCourse
);

courseRoute.delete("/:id",
    authMiddleware,
    roleMiddleware(ROLES.INSTRUCTOR, ROLES.ADMIN),
    deleteCourse
);

export default courseRoute;