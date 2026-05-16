import { body } from "express-validator";

export const createReviewValidation = [
    // Rating
    body("rating")
        .notEmpty().withMessage("Rating is required")
        .isInt({ min: 1, max: 5 })
        .withMessage("Rating must be between 1 and 5"),

    // Message
    body("message")
        .trim()
        .notEmpty().withMessage("Review message is required")
        .isLength({ min: 10, max: 500 })
        .withMessage("Review message must be between 10 and 500 characters")
];