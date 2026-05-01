import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();


// Middlewares
app.use(cors());
app.use(express.json());


// Test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "API running"
    });
});

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