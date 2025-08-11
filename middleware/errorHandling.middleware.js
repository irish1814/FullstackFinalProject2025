/**
 * Middleware to handle invalid JSON format errors.
 * Catches SyntaxErrors thrown by body-parser when JSON is malformed.
 */
function invalidJsonFormat(err, req, res, next) {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).send({ message: 'Invalid JSON format' });
    }

    console.error('[Unhandled Error]', err);
    res.status(500).send({ message: 'Internal server error' });
}

/**
 * Global error handling middleware.
 * Handles Mongoose errors, duplicate keys, and other known errors.
 */
function errorMiddleware (err, req, res, next) {
    try {
        let error = { ...err };
        error.message = err.message;
        console.error('[Unhandled Error]', err);

        if (err.name === 'CastError') {
            const message = 'Resource Not Found';
            error = new Error(message);
            error.statusCode = 404;
        }

        // Duplicate key in DB
        if (err.code === 11000) {
            const message = 'Duplicate field value entered';
            error = new Error(message);
            error.statusCode = 400;
        }

        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(val => val.message).join(', ');
            error = new Error(message);
            error.statusCode = 400;
        }
        res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Internal server error' });
    } catch (error) {
        next(error);
    }
}

export { invalidJsonFormat, errorMiddleware };