const { check } = require("express-validator");
const { Router } = require("express");

const authMiddleware = require("/middlewares/auth.middleware");
const checkValidMiddleware = require("/middlewares/checkValid.middleware");
const routesByName = require("/routes/routesByName");

const router = Router();
module.exports = router;

const Controller = require("/controllers/parseTemplates");

// api/parse-templates/create
const createValidation = [
  check("title", "Title is required").isString().notEmpty(),
  check("url", "Invalid URL").isString().isURL().notEmpty(),
  check("selectorsData", "Selectors Data is empty").isObject().notEmpty(),
  check("selectorsData.parent", "Parent is empty").isString().notEmpty(),
  check("selectorsData.selectors", "Selectors is empty").isArray().notEmpty(),
];
router.post(
  routesByName.parseTemplates.create,
  authMiddleware,
  createValidation,
  Controller.create
);

// api/parse-templates/list
const listValidation = [
  check("offset", "Offset is required").isNumeric().isInt(),
];
router.post(
  routesByName.parseTemplates.list,
  authMiddleware,
  listValidation,
  Controller.getList
);

// api/parse-templates/turn-parse
const turnParseValidation = [
  check("id", "Id required").isString().notEmpty(),
  check("enabled", "Enabled is not specified").isBoolean().notEmpty(),
  check("parseTime", "Parse time is not specified").custom(
    async (parseTime, { req }) => {
      if (!parseTime && req.body.enabled) {
        throw new Error("Parse time in not specified");
      }
    }
  ),
];
router.put(
  routesByName.parseTemplates.turnParseEnabled,
  authMiddleware,
  turnParseValidation,
  checkValidMiddleware,
  Controller.turnParse
);
