import express from "express"
const userRoute = express.Router()
import authMiddleware from "../../middlewares/auth.middleware.js"
import { me } from "./user.controller.js"

userRoute.get("/me",
    authMiddleware,
    me
);

export default userRoute;