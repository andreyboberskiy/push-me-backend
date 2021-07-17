const { Router } = require("express");
const router = Router();

const { check } = require("express-validator");

const authMiddleware = require("../middlewares/auth.middleware");

const routesByName = require("/routes/routesByName");

const ParserController = require("/controllers/parser");

module.exports = router;

router.post(routesByName.parse.byHTMLSelector, authMiddleware, [
  check("url", "Url is empty").notEmpty(),
  check("selector", "Empty selector").notEmpty(),
  ParserController.byHTMLSelector,
]);

router.post(routesByName.parse.byHTMLSelectorWithPage, authMiddleware, [
  check("url", "Url is empty").notEmpty(),
  check("secondPageUrl", "Second page url is empty").notEmpty(),
  check("selector", "Empty selector query").notEmpty(),
  check("pageCount", "Page count is empty").notEmpty(),
  ParserController.byHTMLSelectorWithPage,
]);

router.post(routesByName.parse.byTextQuery, authMiddleware, [
  check("url", "Url is empty").notEmpty(),
  check("selectorQuery", "Empty selector query").notEmpty(),
  ParserController.byTextQuery,
]);
