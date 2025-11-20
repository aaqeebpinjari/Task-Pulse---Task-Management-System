/* eslint-disable no-unused-vars */

// Middleware: Centralized error handler to send clean error responses
const errorHandler = (err, _req, res, _next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  // send error json format 
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    errors: err.errors || undefined,
  });
};

module.exports = errorHandler;

