import { body } from "express-validator"

export const registerValidation = [
    // Name
    body("name")
        .trim()
        .notEmpty().withMessage("Name is required")
        .isLength({ min: 3, max: 30 }).withMessage("Name must be 3-30 characters")
        .matches(/^[a-zA-Z\s]+$/).withMessage("Name must contain only letters"),

    // Email
    body("email")
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Invalid email format")
        .normalizeEmail(),

    // Password
    body("password")
        .trim()
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
        .matches(/[A-Z]/).withMessage("Must contain at least one uppercase letter")
        .matches(/[a-z]/).withMessage("Must contain at least one lowercase letter")
        .matches(/[0-9]/).withMessage("Must contain at least one number")
        .matches(/[@$!%*?&]/).withMessage("Must contain at least one special character"),

    // Role
    body('role')
        .optional()
        .trim()
        .notEmpty().withMessage("Role is required")
        .isIn(['student', 'instructor'])
        .withMessage('role must be student or instructor'),
];

export const loginValidation = [
    // Email
    body("email")
        .isEmail().withMessage("Invalid email"),

    // Password
    body("password")
        .notEmpty().withMessage("Password is required")
];