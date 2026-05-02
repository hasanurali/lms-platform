import userModel from '../modules/user/user.model.js'
import jwt from 'jsonwebtoken'
import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/apiError.js'
import { config } from '../config/index.js'
import { HTTP_STATUS, MESSAGES } from '../constants/index.js'


const authMiddleware = asyncHandler(async (req, res, next) => {

    const authHeader = req.headers.authorization;

    const token = req.cookies.accessToken || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

    if (!token) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED);
    }

    let decoded;
    try {
        decoded = jwt.verify(token, config.jwt.ACCESS.SECRET);
    } catch (err) {

        if (err.name === "TokenExpiredError") {
            throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Token expired");
        }

        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid token");

    };

    const user = await userModel.findById(decoded.id);
    if (!user) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED);
    }

    req.user = user;
    next();
});

export default authMiddleware;