import { body } from "express-validator";

export const createDoubtValidation = [
    // Course
    body("course")
        .trim()
        .notEmpty().withMessage("Course id is required")
        .isMongoId().withMessage("Invalid course id"),

    // Lesson
    body("lesson")
        .trim()
        .notEmpty().withMessage("Lesson id is required")
        .isMongoId().withMessage("Invalid lesson id"),

    // Title
    body("title")
        .trim()
        .notEmpty().withMessage("Title is required")
        .isLength({ min: 3, max: 100 })
        .withMessage("Title must be between 3 and 100 characters"),

    // Description (will be stored as the first reply)
    body("description")
        .trim()
        .notEmpty().withMessage("Description is required")
        .isLength({ min: 5, max: 5000 })
        .withMessage("Description must be between 5 and 5000 characters")
];

export const createReplyValidation = [

    // Message
    body("message")
        .trim()
        .notEmpty().withMessage("Message is required")
        .isLength({ min: 5, max: 5000 })
        .withMessage("Message must be between 5 and 5000 characters")
];