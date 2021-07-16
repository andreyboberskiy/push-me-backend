const { Router } = require("express");
const router = Router();

const { check } = require("express-validator");

const authMiddleware = require("../middlewares/auth.middleware");

const routesByName = require("/routes/routesByName");

const ParserController = require("/controllers/parser");

module.exports = router;

// api/parse/last-items
router.post(routesByName.parse.lastItemsWrapper, authMiddleware, [
  check("url", "Url is empty").notEmpty(),
  check("selectorsData", "Empty selectors").notEmpty(),
  ParserController.lastItemsWrapper,
]);

router.post(routesByName.parse.byTextTemplate, authMiddleware, [
  check("url", "Url is empty").notEmpty(),
  check("selectors", "Selectors is empty").isArray().notEmpty(),
  ParserController.byTextTemplate,
]);
