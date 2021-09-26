const { Router } = require("express");

// config
const routesByName = require("/constants/routesByName");

// middlewares
const authMiddleware = require("/middlewares/auth.middleware");

// controllers
const UserController = require("/controllers/user");

// validation
const validation = require("./validation");
const checkValidMiddleware = require("/middlewares/checkValid.middleware");

const router = Router();

// /api/user/add-telegram-id
router.post(
  routesByName.user.addTelegramId,
  authMiddleware,
  validation.addTelegramId,
  checkValidMiddleware,
  UserController.addTelegramId
);

module.exports = router;
