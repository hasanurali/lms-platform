import express from "express";
import cors from "cors";
import cookiePerser from "cookie-parser"
import errorHandler from "./middlewares/error.middleware.js";
import authRoute from "./modules/auth/auth.route.js"
import userRoute from "./modules/user/user.route.js";
import courseRoute from "./modules/course/course.route.js";
import moduleRoute from "./modules/module/module.route.js";

const app = express();


// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookiePerser());


// Test route
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


// Not found route
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Globle error handler
app.use(errorHandler);

export default app;