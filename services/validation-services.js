const ApiError = require("/exceptions/api-error");
const { validationResult } = require("express-validator");

const checkRouteValidation = (req) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw ApiError.BadRequest("Invalid data", errors.array());
  }
};

module.exports.checkRouteValidation = checkRouteValidation;
