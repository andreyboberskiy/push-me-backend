const { check } = require("express-validator");

const validation = {
  addTelegramId: [check(["chatId"], "Field is required").notEmpty()],
};

module.exports = validation;
