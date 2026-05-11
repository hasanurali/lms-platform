import express from "express"
const doubtRoute = express.Router()
import authMiddleware from "../../middlewares/auth.middleware.js"
import roleMiddleware from "../../middlewares/role.middleware.js"
import { createDoubtValidation, createReplyValidation } from "./doubt.validation.js"
import validate from "../../middlewares/validation.result.middleware.js"
import { createDoubt, getLessonDoubts, getMyDoubts, getCourseDoubts, getDoubtDetails, replyToDoubt } from "./doubt.controller.js"
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

doubtRoute.get("/doubts/:id",
    authMiddleware,
    getDoubtDetails
);

doubtRoute.post("/doubts/:id/replies",
    authMiddleware,
    createReplyValidation,
    validate,
    replyToDoubt
);


export default doubtRoute;