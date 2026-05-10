import rateLimit from "express-rate-limit";
import { HTTP_STATUS } from "../constants/index.js";

// General api limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
    message: {
        success: false,
        message: "Too many requests, please try again later."
    }
});

// Auth limiter
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
    message: {
        success: false,
        message: "Too many authentication attempts, please try again later."
    }
});