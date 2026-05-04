import express from "express"
const enrollmentRoute = express.Router()
import authMiddleware from "../../middlewares/auth.middleware.js"
import { createEnrollment } from "./enrollment.controller.js"


enrollmentRoute.post("/courses/:id/enroll",
    authMiddleware,
    createEnrollment
);

export default enrollmentRoute;