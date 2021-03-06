const { checkRouteValidation } = require("/services/validation");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    checkRouteValidation(req);

    next();
  } catch (e) {
    next(e);
  }
};
