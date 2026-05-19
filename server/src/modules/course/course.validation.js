import { body } from "express-validator";

export const createCourseValidation = [

    // Title
    body("title")
        .trim()
        .notEmpty().withMessage("Title is required")
        .isLength({ min: 3, max: 50 }).withMessage("Title must be 3-50 characters"),

    // Description
    body("description")
        .trim()
        .notEmpty().withMessage("Description is required")
        .isLength({ min: 10, max: 500 }).withMessage("Description must be 10-500 characters"),

    // Price (optional)
    body("price")
        .optional()
        .isInt({ min: 0, max: 100000 })
        .withMessage("Price must be between 0 and 100000"),
];

export const updateCourseValidation = [

    // Title (optional)
    body("title")
        .optional()
        .trim()
        .isLength({ min: 3, max: 50 }).withMessage("Title must be 3-50 characters"),

    // Description (optional)
    body("description")
        .optional()
        .trim()
        .isLength({ min: 10, max: 500 }).withMessage("Description must be 10-500 characters"),

    // Price (optional)
    body("price")
        .optional()
        .isInt({ min: 0, max: 100000 })
        .withMessage("Price must be between 0 and 100000"),

    // Published (optional)
    body("isPublished")
        .optional()
        .isBoolean().withMessage("Is published must be a boolean")
];