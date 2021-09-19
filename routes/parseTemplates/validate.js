const { check } = require("express-validator");

function parseTimeCustomValidation(value) {
  let specified = false;
  Object.keys(value).forEach((key) => {
    if (value[key] > 0) {
      specified = true;
    }
  });
  return specified;
}
const validate = {
  create: [
    check(
      ["title", "url", "selectorsData", "selectorsData.parent", "parseTime"],
      "Field is required"
    ).notEmpty(),
    check(
      ["url", "title", "selectorsData.parent"],
      "Field must be a string"
    ).isString(),
    check(["selectorsData", "parseTime"], "Field must be an object").isObject(),
    check("parseTime", "Parse time must be greater than 0").custom(
      parseTimeCustomValidation
    ),
    check("selectorsData.selectors", "Field must be an array").isArray(),
  ],
};

module.exports = validate;
