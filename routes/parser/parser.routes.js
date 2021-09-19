const { Router } = require("express");
const { check } = require("express-validator");

const router = Router();

// middlewares
const authMiddleware = require("/middlewares/auth.middleware");
const checkValidMiddleware = require("/middlewares/checkValid.middleware");

// configs
const routesByName = require("/constants/routesByName");

// controllers
const ParserController = require("/controllers/parser");

router.post(routesByName.parse.byHTMLSelector, authMiddleware, [
  check("url", "Url is empty").notEmpty(),
  check("selector", "Empty selector").notEmpty(),
  checkValidMiddleware,
  ParserController.byHTMLSelector,
]);

// router.post(routesByName.parse.byHTMLSelectorWithPage, authMiddleware, [
//   check("url", "Url is empty").notEmpty(),
//   check("secondPageUrl", "Second page url is empty").notEmpty(),
//   check("selector", "Empty selector query").notEmpty(),
//   check("pageCount", "Page count is empty").notEmpty(),
//   checkValidMiddleware,
//   ParserController.byHTMLSelectorWithPage,
// ]);

router.post(routesByName.parse.byTextQuery, authMiddleware, [
  check("url", "Url is empty").notEmpty(),
  check("selectorQuery", "Empty selector query").notEmpty(),
  check("approvedQueries", "Approved Queries is not specified").isArray(),
  checkValidMiddleware,
  ParserController.byTextQuery,
]);

module.exports = router;
