import express from "express"
const progressRoute = express.Router()
import authMiddleware from "../../middlewares/auth.middleware.js"
import { getProgress, completeLesson, setLastAccessedLesson } from "./progress.controller.js"


progressRoute.get("/:courseId",
    authMiddleware,
    getProgress
);

progressRoute.post("/complete-lesson",
    authMiddleware,
    completeLesson
);

progressRoute.post("/last-lesson",
    authMiddleware,
    setLastAccessedLesson
);


export default progressRoute;