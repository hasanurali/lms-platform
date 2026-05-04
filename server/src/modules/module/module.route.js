import express from "express"
const moduleRoute = express.Router()
import authMiddleware from "../../middlewares/auth.middleware.js";
import roleMiddleware from "../../middlewares/role.middleware.js";
import { ROLES } from "../../constants/index.js";
import { createModuleValidation, updateModuleValidation } from "./module.validation.js"
import validate from "../../middlewares/validation.result.middleware.js";
import { createModule, getModules, updateModule } from "./module.controller.js"


moduleRoute.post("/courses/:id/modules",
    authMiddleware,
    roleMiddleware(ROLES.INSTRUCTOR, ROLES.ADMIN),
    createModuleValidation,
    validate,
    createModule
);

moduleRoute.get("/courses/:id/modules",
    authMiddleware,
    getModules
);

moduleRoute.put("/modules/:id",
    authMiddleware,
    roleMiddleware(ROLES.INSTRUCTOR, ROLES.ADMIN),
    updateModuleValidation,
    validate,
    updateModule
);

export default moduleRoute;