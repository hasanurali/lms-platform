import express from "express";
import cors from "cors";

const app = express();

// middleware
app.use(cors());
app.use(express.json());


// test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "API running"
    });
});

// not found route
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

export default app;