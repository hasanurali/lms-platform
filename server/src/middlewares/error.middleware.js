import log from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // handle Mongo / JWT errors
    if (err.name === "CastError") {
        message = "Invalid ID";
        statusCode = 400;
    }

    if (err.code === 11000) {
        message = "Duplicate field value";
        statusCode = 400;
    }

    if (err.name === "JsonWebTokenError") {
        message = "Invalid token";
        statusCode = 401;
    }

    if (process.env.NODE_ENV === "production" && !err.isOperational) {
        message = "Something went wrong";
    }

    log(`Message: ${message}
         Status: ${statusCode}
         Route: ${req.method} ${req.originalUrl}
         Time: ${new Date().toISOString()}
         Stack: ${err.stack}`, "ERROR");

    res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || []
    });
};

export default errorHandler;