//Handles 404 - route not found errors
const notFound = (_req, res, _next) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found',
  });
};

module.exports = notFound;

