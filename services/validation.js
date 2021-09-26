const ApiError = require("/exceptions/api-error");
const { validationResult } = require("express-validator");

const checkRouteValidation = (req) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw ApiError.BadRequest("Invalid data", errors.array());
  }
};

const checkMaxLength = (text, maxLength) => {
  return text?.length <= maxLength;
};
const checkMinLength = (text, minLength) => {
  return text?.length > minLength;
};

module.exports.checkRouteValidation = checkRouteValidation;
module.exports.checkMaxLength = checkMaxLength;
module.exports.checkMinLength = checkMinLength;
