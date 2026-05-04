import { body } from "express-validator";

export const createLessonValidation = [

    // Title
    body("title")
        .trim()
        .notEmpty().withMessage("Title is required")
        .isLength({ min: 3, max: 50 }).withMessage("Title must be 3-50 characters"),

    // video url
    body("videoUrl")
        .trim()
        .notEmpty().withMessage("Video url is required")
        .isURL().withMessage("Video url must be a valid URL"),

    // content (optional)
    body("content")
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 1000 }).withMessage("Content must be less than 1000 characters")
];