const { Router } = require("express");
const router = Router();

const { check } = require("express-validator");

const authMiddleware = require("../middlewares/auth.middleware");

const routesByName = require("/routes/routesByName");

const ParserController = require("/controllers/parser");

module.exports = router;

// api/parse/last-items
router.post(routesByName.parse.lastItems, authMiddleware, [
  check("url", "Url is empty").notEmpty(),
  check("classes", "Empty classes").notEmpty(),
  ParserController.lastItems,
]);
