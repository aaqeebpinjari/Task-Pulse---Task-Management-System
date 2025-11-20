//Validates incoming request data using express-validator
const { validationResult } = require('express-validator');

const validateRequest = (req, _res, next) => {
  const errors = validationResult(req);
  // If validation fails, throw error else show results
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 422;
    error.errors = errors.array();
    return next(error);
  }
  return next();
};

module.exports = validateRequest;

