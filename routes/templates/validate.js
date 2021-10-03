const { check } = require("express-validator");
const { forEach } = require("lodash");

const { checkMaxLength, checkMinLength } = require("/services/validation");

function parseTimeCustomValidation(value) {
  let specified = false;
  Object.keys(value).forEach((key) => {
    if (value[key] > 0) {
      specified = true;
    }
  });
  return specified;
}

function selectorsCustomValidation(selectorsData) {
  let valid = true;

  forEach(selectorsData, (selectorsData) => {
    const { title, selector } = selectorsData;
    if (
      !checkMaxLength(title, 255) ||
      !checkMinLength(title, 0) ||
      !checkMaxLength(selector, 1000) ||
      !checkMinLength(selector, 1)
    ) {
      valid = false;
    }
  });
  return valid;
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
    check("selectorsData.selectors", "Invalid selectors").custom(
      selectorsCustomValidation
    ),
  ],
};

module.exports = validate;
