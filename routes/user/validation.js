const { check } = require("express-validator");

const validation = {
  addTelegramId: [check(["id"], "Field is required").notEmpty()],
};

module.exports = validation;
