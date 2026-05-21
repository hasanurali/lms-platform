import express from "express"
const moduleRoute = express.Router()
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import { ROLES } from "../../constants/index.js";
import { createModuleValidation, updateModuleValidation } from "./module.validation.js"
import validate from "../../middlewares/validation.result.middleware.js";
import { createModule, getModules, updateModule, deleteModule } from "./module.controller.js"

/**
 * @swagger
 * tags:
 *   name: Modules
 *   description: Module management — create, retrieve, update, and delete course modules
 */

/**
 * @swagger
 * /courses/{id}/modules:
 *   post:
 *     summary: Create a new module
 *     tags: [Modules]
 *     security:
 *       - cookieAuth: []
 *     description: >
 *       Creates a new module under the specified course.
 *       The order field is assigned automatically — first module gets order 1,
 *       each subsequent module increments by 1. Order cannot be set via the API.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Introduction to Variables
 *     responses:
 *       201:
 *         description: Module created successfully
 *       400:
 *         description: Validation error or invalid course ID
 *       401:
 *         description: Not authorized or token expired/invalid
 *       403:
 *         description: Access denied or not the course owner
 *       404:
 *         description: Course not found
 */
moduleRoute.post("/courses/:id/modules",
    authMiddleware,
    roleMiddleware(ROLES.INSTRUCTOR, ROLES.ADMIN),
    createModuleValidation,
    validate,
    createModule
);

/**
 * @swagger
 * /courses/{id}/modules:
 *   get:
 *     summary: Get all modules for a course
 *     tags: [Modules]
 *     description: Retrieves all modules for the specified course, sorted by order ascending.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Modules fetched successfully
 *       400:
 *         description: Invalid course ID format
 *       404:
 *         description: Course not found
 */
moduleRoute.get("/courses/:id/modules",
    getModules
);

/**
 * @swagger
 * /modules/{id}:
 *   put:
 *     summary: Update a module
 *     tags: [Modules]
 *     security:
 *       - cookieAuth: []
 *     description: >
 *       Updates the title of a module. Only title can be updated;
 *       order cannot be changed via the API.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Module Title
 *     responses:
 *       200:
 *         description: Module updated successfully
 *       400:
 *         description: Validation error or invalid module ID
 *       401:
 *         description: Not authorized or token expired/invalid
 *       403:
 *         description: Access denied or not the course owner
 *       404:
 *         description: Module not found
 */
moduleRoute.put("/modules/:id",
    authMiddleware,
    roleMiddleware(ROLES.INSTRUCTOR, ROLES.ADMIN),
    updateModuleValidation,
    validate,
    updateModule
);

/**
 * @swagger
 * /modules/{id}:
 *   delete:
 *     summary: Delete a module
 *     tags: [Modules]
 *     security:
 *       - cookieAuth: []
 *     description: >
 *       Permanently deletes a module, all of its associated lessons,
 *       and their videos from Cloudinary.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Module ID
 *     responses:
 *       200:
 *         description: Module deleted successfully
 *       400:
 *         description: Invalid module ID format
 *       401:
 *         description: Not authorized or token expired/invalid
 *       403:
 *         description: Access denied or not the course owner
 *       404:
 *         description: Module not found
 */
moduleRoute.delete("/modules/:id",
    authMiddleware,
    roleMiddleware(ROLES.INSTRUCTOR, ROLES.ADMIN),
    deleteModule
);

export default moduleRoute;