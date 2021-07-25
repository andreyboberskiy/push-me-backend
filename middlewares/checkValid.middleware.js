const { checkRouteValidation } = require("/services/validation-services");

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
