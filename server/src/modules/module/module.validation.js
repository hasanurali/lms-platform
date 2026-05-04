import { body } from "express-validator";

export const createModuleValidation = [

    // Title
    body("title")
        .trim()
        .notEmpty().withMessage("Title is required")
        .isLength({ min: 3, max: 50 }).withMessage("Title must be 3-50 characters")
];