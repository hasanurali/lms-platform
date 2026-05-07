import express from "express"
const userRoute = express.Router()
import authMiddleware from "../../middlewares/auth.middleware.js"
import roleMiddleware from "../../middlewares/role.middleware.js"
import { ROLES } from "../../constants/index.js"
import { me, getUsers } from "./user.controller.js"

userRoute.get("/me",
    authMiddleware,
    me
);

userRoute.get("/",
    authMiddleware,
    roleMiddleware(ROLES.ADMIN),
    getUsers
);

export default userRoute;