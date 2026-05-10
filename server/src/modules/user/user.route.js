import express from "express"
const userRoute = express.Router()
import authMiddleware from "../../middlewares/auth.middleware.js"
import roleMiddleware from "../../middlewares/role.middleware.js"
import { ROLES } from "../../constants/index.js"
import { me, getUsers, getUser, updateProfile } from "./user.controller.js"
import { updateProfileValidation } from "./user.validation.js"
import validate from "../../middlewares/validation.result.middleware.js"
import multerImageMiddleware from "../../middlewares/multerImage.middleware.js"

userRoute.get("/me",
    authMiddleware,
    me
);

userRoute.get("/",
    authMiddleware,
    roleMiddleware(ROLES.ADMIN),
    getUsers
);

userRoute.get("/:id",
    authMiddleware,
    getUser
);

userRoute.put("/me",
    authMiddleware,
    multerImageMiddleware.single("profilePicture"),
    updateProfileValidation,
    validate,
    updateProfile
);

export default userRoute;