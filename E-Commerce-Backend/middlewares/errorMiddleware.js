const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    // If response has already been sent, delegate to default Express handler
    if (res.headersSent) {
        return next(err);
    }

    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode).json({
        message: err.message,
        // only include stack in development
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = { notFound, errorHandler };
