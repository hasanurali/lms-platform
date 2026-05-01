import express from "express"
const authRoute = express.Router()
import { registerValidation, loginValidation } from "./auth.validation.js"
import validate from "../../middlewares/validation.result.middleware.js"
import { register, login } from "./auth.controller.js"

authRoute.post("/register",
    registerValidation,
    validate,
    register
);

authRoute.post("/login",
    loginValidation,
    validate,
    login
);

export default authRoute;