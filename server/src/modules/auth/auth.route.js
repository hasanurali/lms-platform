import express from "express"
const authRoute = express.Router()
import { registerValidation, loginValidation } from "./auth.validation.js"
import validate from "../../middlewares/validation.result.middleware.js"
import { register, login, logout, refresh } from "./auth.controller.js"
import authMiddleware from "../../middlewares/auth.middleware.js"
import { authLimiter } from "../../middlewares/rateLimit.middleware.js"

authRoute.post("/register",
    authLimiter,
    registerValidation,
    validate,
    register
);

authRoute.post("/login",
    authLimiter,
    loginValidation,
    validate,
    login
);

authRoute.post("/logout",
    authMiddleware,
    logout
);

authRoute.post("/refresh",
    authLimiter,
    refresh
)

export default authRoute;