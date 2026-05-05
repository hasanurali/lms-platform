import express from "express"
const progressRoute = express.Router()
import authMiddleware from "../../middlewares/auth.middleware.js"
import { getProgress } from "./progress.controller.js"


progressRoute.get("/:courseId",
    authMiddleware,
    getProgress
)

export default progressRoute;