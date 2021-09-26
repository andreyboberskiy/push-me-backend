const { check } = require("express-validator");
const { Router } = require("express");

const authMiddleware = require("/middlewares/auth.middleware");
const checkValidMiddleware = require("/middlewares/checkValid.middleware");
const routesByName = require("/constants/routesByName");

const router = Router();
module.exports = router;

const Controller = require("/controllers/notification");

// api/notifications/check-updates-now
const checkUpdatesValidation = [
  check("id", "Id required").isString().notEmpty(),
];
router.post(
  routesByName.notifications.checkUpdatesNow,
  authMiddleware,
  checkUpdatesValidation,
  checkValidMiddleware,
  Controller.checkUpdatesNow
);

// api/notifications/get-list
const getListValidation = [check("id", "Id required").isString().notEmpty()];
router.post(
  routesByName.notifications.getList,
  authMiddleware,
  getListValidation,
  checkValidMiddleware,
  Controller.getListByTemplate
);
