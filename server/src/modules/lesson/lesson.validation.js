import { body } from "express-validator";

export const createLessonValidation = [

    // Title
    body("title")
        .trim()
        .notEmpty().withMessage("Title is required")
        .isLength({ min: 3, max: 50 }).withMessage("Title must be 3-50 characters"),

    // content (optional)
    body("content")
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage("Content must be less than 1000 characters")
];

export const updateLessonValidation = [

    // Title (optional)
    body("title")
        .optional()
        .trim()
        .isLength({ min: 3, max: 50 }).withMessage("Title must be 3-50 characters"),

    // content (optional)
    body("content")
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage("Content must be less than 1000 characters")
];