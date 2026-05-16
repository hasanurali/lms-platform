import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import hpp from "hpp";

import { apiLimiter } from "./middlewares/rateLimit.middleware.js";
import errorHandler from "./middlewares/error.middleware.js";
import mongoSanitizeMiddleware from "./middlewares/mongoSanitize.middleware.js"
import { config } from "./config/index.js";

import authRoute from "./modules/auth/auth.route.js";
import userRoute from "./modules/user/user.route.js";
import courseRoute from "./modules/course/course.route.js";
import moduleRoute from "./modules/module/module.route.js";
import lessonRoute from "./modules/lesson/lesson.route.js";
import enrollmentRoute from "./modules/enrollment/enrollment.route.js";
import progressRoute from "./modules/progress/progress.route.js";
import doubtRoute from "./modules/doubt/doubt.route.js";
import reviewRoute from "./modules/review/review.route.js";

const app = express();

// Security Middlewares
app.use(helmet());
app.use(mongoSanitizeMiddleware);
app.use(hpp());

// General Middlewares
app.use(cors(config.corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

// Global Api Rate Limiter
app.use("/api/v1", apiLimiter);

// Test Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "API running"
    });
});

// Main Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/courses", courseRoute);
app.use("/api/v1", moduleRoute);
app.use("/api/v1", lessonRoute);
app.use("/api/v1", enrollmentRoute);
app.use("/api/v1/progress", progressRoute);
app.use("/api/v1", doubtRoute);
app.use("/api/v1", reviewRoute);


// Not Found Route
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Global Error Handler
app.use(errorHandler);

export default app;