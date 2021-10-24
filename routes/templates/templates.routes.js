const { check } = require("express-validator");
const { Router } = require("express");

const router = Router();

// middlewares
const authMiddleware = require("/middlewares/auth.middleware");
const checkValidMiddleware = require("/middlewares/checkValid.middleware");

// configs
const routesByName = require("/constants/routesByName");

// controllers
const Controller = require("/controllers/template");

// validation
const validation = require("./validate");

// api/template/:id
router.get(
  routesByName.templates.getTemplate,
  authMiddleware,
  checkValidMiddleware,
  Controller.getTemplate
);

// api/template/create
router.post(
  routesByName.templates.create,
  authMiddleware,
  validation.create,
  checkValidMiddleware,
  Controller.create
);

// api/templates/my-list
// const listValidation = [
//   check("offset", "Offset is required").isNumeric().isInt(),
// ];
router.post(
  routesByName.templates.myList,
  authMiddleware,
  // listValidation,
  // checkValidMiddleware,
  Controller.getMyList
);

// api/templates/turn-parse
const turnParseValidation = [
  check("id", "Id required").isString().notEmpty(),
  check("enabled", "Enabled is not specified").isBoolean().notEmpty(),
];

router.put(
  routesByName.templates.turnParseEnabled,
  authMiddleware,
  turnParseValidation,
  checkValidMiddleware,
  Controller.turnEnabled
);

// api/template/update-image
router.post(
  routesByName.templates.updateImage,
  authMiddleware,
  Controller.updateImage
);

module.exports = router;
