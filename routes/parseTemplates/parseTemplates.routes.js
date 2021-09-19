const { check } = require("express-validator");
const { Router } = require("express");

const router = Router();

// middlewares
const authMiddleware = require("/middlewares/auth.middleware");
const checkValidMiddleware = require("/middlewares/checkValid.middleware");

// configs
const routesByName = require("/constants/routesByName");

// controllers
const Controller = require("/controllers/parseTemplates");

// validation

const validation = require("./validate");

// api/parse-templates/create
router.post(
  routesByName.parseTemplates.create,
  authMiddleware,
  validation.create,
  checkValidMiddleware,
  Controller.create
);

// api/parse-templates/list
// const listValidation = [
//   check("offset", "Offset is required").isNumeric().isInt(),
// ];
router.post(
  routesByName.parseTemplates.list,
  authMiddleware,
  // listValidation,
  // checkValidMiddleware,
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
module.exports = router;
