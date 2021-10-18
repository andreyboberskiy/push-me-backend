module.exports = class ApiError extends Error {
  status;
  validationErrors;

  constructor(status, message, errors = []) {
    super(message);

    this.status = status;
    this.validationErrors = errors;
  }

  static unAuthorizedError() {
    return new ApiError(401, "User is not authorized");
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }

  static NotFound(message, errors = []) {
    return new ApiError(404, message, errors);
  }
};
