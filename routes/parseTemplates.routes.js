const { check } = require("express-validator");
const { Router } = require("express");

const authMiddleware = require("/middlewares/auth.middleware");
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
