import express from "express"
const doubtRoute = express.Router()
import authMiddleware from "../../middlewares/auth.middleware.js"
import { createDoubtValidation } from "./doubt.validation.js"
import validate from "../../middlewares/validation.result.middleware.js"
import { createDoubt } from "./doubt.controller.js"


doubtRoute.post("/doubts",
    authMiddleware,
    createDoubtValidation,
    validate,
    createDoubt
);


export default doubtRoute;