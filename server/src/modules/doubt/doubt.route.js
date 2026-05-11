import express from "express"
const doubtRoute = express.Router()
import authMiddleware from "../../middlewares/auth.middleware.js"
import roleMiddleware from "../../middlewares/role.middleware.js"
import { createDoubtValidation } from "./doubt.validation.js"
import validate from "../../middlewares/validation.result.middleware.js"
import { createDoubt, getLessonDoubts, getMyDoubts, getCourseDoubts } from "./doubt.controller.js"
import { ROLES } from "../../constants/index.js"


doubtRoute.post("/doubts",
    authMiddleware,
    createDoubtValidation,
    validate,
    createDoubt
);

doubtRoute.get("/lessons/:id/doubts",
    authMiddleware,
    getLessonDoubts
);

doubtRoute.get("/doubts/my",
    authMiddleware,
    getMyDoubts
);

doubtRoute.get("/courses/:id/doubts",
    authMiddleware,
    roleMiddleware(ROLES.ADMIN, ROLES.INSTRUCTOR),
    getCourseDoubts
);


export default doubtRoute;