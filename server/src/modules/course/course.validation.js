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

    // Thumbnail (optional)
    body("thumbnail")
        .optional({ checkFalsy: true })
        .trim()
        .isURL().withMessage("Thumbnail must be a valid URL"),
];