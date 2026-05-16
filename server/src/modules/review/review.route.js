import express from "express"
const reviewRoute = express.Router()
import authMiddleware from "../../middlewares/auth.middleware.js"
import { createReviewValidation } from "./review.validation.js"
import validate from "../../middlewares/validation.result.middleware.js"
import { createReview } from "./review.controller.js"


reviewRoute.post("/courses/:id/reviews",
    authMiddleware,
    createReviewValidation,
    validate,
    createReview
);

export default reviewRoute;