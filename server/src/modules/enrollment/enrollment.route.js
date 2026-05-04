import express from "express"
const enrollmentRoute = express.Router()
import authMiddleware from "../../middlewares/auth.middleware.js"
import { createEnrollment, getEnrollments } from "./enrollment.controller.js"


enrollmentRoute.post("/courses/:id/enroll",
    authMiddleware,
    createEnrollment
);

enrollmentRoute.get("/enrollments/my",
    authMiddleware,
    getEnrollments
);

export default enrollmentRoute;