const errorMiddleware = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Mongoose: Invalid ObjectId
    if (err.name === "CastError") {
        message = `Invalid value for ${err.path}: ${err.value}`;
        statusCode = 400;
    }

    // Mongoose: Validation error
    if (err.name === "ValidationError") {
        message = Object.values(err.errors)
            .map((val) => val.message)
            .join(", ");
        statusCode = 400;
    }

    // Mongo: Duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue).join(", ");
        message = `Duplicate field value: ${field}`;
        statusCode = 400;
    }

    // JWT errors
    if (err.name === "JsonWebTokenError") {
        message = "Invalid token. Please log in again.";
        statusCode = 401;
    }

    if (err.name === "TokenExpiredError") {
        message = "Your token has expired. Please log in again.";
        statusCode = 401;
    }

    res.status(statusCode).json({
        success: false,
        error: {
            message,
            type: err.name || "Error",
            ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
        },
    });
};

export default errorMiddleware;
