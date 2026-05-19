import userModel from '../modules/user/user.model.js'
import jwt from 'jsonwebtoken'
import asyncHandler from '../utils/asyncHandler.js'
import { config } from '../config/index.js'


const optionalMiddleware = asyncHandler(async (req, res, next) => {

    const authHeader = req.headers.authorization;

    const token = req.cookies.accessToken || (authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

    if (!token) {
        return next();
    }

    try {
        let decoded = jwt.verify(token, config.jwt.ACCESS.SECRET);
        const user = await userModel.findOne({ _id: decoded?.id, isVerified: true });
        if (user) {
            req.user = user;
        }
    } catch (error) { };

    return next();
});

export default optionalMiddleware;