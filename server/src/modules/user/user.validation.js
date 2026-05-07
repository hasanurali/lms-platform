import { body } from "express-validator"

export const updateProfileValidation = [
    // Name (optional)
    body("name")
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 3, max: 30 }).withMessage("Name must be 3-30 characters")
        .matches(/^[a-zA-Z\s]+$/).withMessage("Name must contain only letters"),

    // profile piture (optional)
    body("profilePicture")
        .optional({ checkFalsy: true })
        .isURL().withMessage("profile picture must be a valid URL"),

    // bio (optional)
    body("bio")
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 500 }).withMessage("Bio must be less than 500 characters")
];