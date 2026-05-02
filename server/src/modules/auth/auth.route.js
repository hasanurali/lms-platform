import express from "express"
const authRoute = express.Router()
import { registerValidation, loginValidation } from "./auth.validation.js"
import validate from "../../middlewares/validation.result.middleware.js"
import { register, login, logout } from "./auth.controller.js"
import authMiddleware from "../../middlewares/auth.middleware.js"

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

authRoute.post("/logout",
    authMiddleware,
    logout
)

export default authRoute;