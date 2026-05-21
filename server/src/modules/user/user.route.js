import express from "express"
const userRoute = express.Router()
import authMiddleware from "../../middlewares/auth.middleware.js"
import roleMiddleware from "../../middlewares/role.middleware.js"
import { ROLES } from "../../constants/index.js"
import { me, getUsers, getUser, updateProfile } from "./user.controller.js"
import { updateProfileValidation } from "./user.validation.js"
import validate from "../../middlewares/validation.result.middleware.js"
import multerImageMiddleware from "../../middlewares/multerImage.middleware.js"

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management — profile, retrieval, and updates
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     description: >
 *       Returns the profile of the currently authenticated user.
 *       Data is read directly from the auth middleware — no additional database call is made.
 *     responses:
 *       200:
 *         description: User fetched successfully
 *       401:
 *         description: Not authorized or token expired/invalid
 */
userRoute.get("/me",
    authMiddleware,
    me
);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     description: >
 *       Retrieves all users excluding admin accounts, with pagination support.
 *       ADMIN role only.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Users fetched successfully with pagination
 *       401:
 *         description: Not authorized or token expired/invalid
 *       403:
 *         description: Access denied — ADMIN role required
 */
userRoute.get("/",
    authMiddleware,
    roleMiddleware(ROLES.ADMIN),
    getUsers
);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User fetched successfully
 *       400:
 *         description: Invalid user ID format
 *       401:
 *         description: Not authorized or token expired/invalid
 *       404:
 *         description: User not found
 */
userRoute.get("/:id",
    authMiddleware,
    getUser
);

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Update current user's profile
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     description: >
 *       Updates the authenticated user's profile. Only provided fields are updated.
 *       If a new profile picture is uploaded and differs from the existing one,
 *       the old image is deleted from Cloudinary and replaced.
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               bio:
 *                 type: string
 *                 example: Updated bio here.
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error (name / bio / file type)
 *       401:
 *         description: Not authorized or token expired/invalid
 *       404:
 *         description: User not found
 */
userRoute.put("/me",
    authMiddleware,
    multerImageMiddleware.single("profilePicture"),
    updateProfileValidation,
    validate,
    updateProfile
);

export default userRoute;