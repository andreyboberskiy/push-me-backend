const rateLimit = require("express-rate-limit");

module.exports = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: "You have exceeded the 2 requests in 10 sec limit!",
  headers: true,
});
