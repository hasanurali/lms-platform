import express from "express"
const authRoute = express.Router()
import { registerValidation } from "./auth.validation.js"
import validate from "../../middlewares/validation.result.middleware.js"
import { register } from "./auth.controller.js"

authRoute.post("/register",
    registerValidation,
    validate,
    register
);

export default authRoute;