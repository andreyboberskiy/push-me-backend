const ApiError = require("/exceptions/api-error");

module.exports = function (err, req, res, next) {
  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ message: err.message, validation: err.validationErrors });
  }
  console.dir(err);
  return res.status(500).json({
    message: "Internal Server Error. Not instance of apiError",
    error: err,
  });
};
