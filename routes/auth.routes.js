const { Router } = require("express");
const { check } = require("express-validator");

const router = Router();

// configs
const routesByName = require("/constants/routesByName");

// middlewares
const checkValidMiddleware = require("/middlewares/checkValid.middleware");

// controllers
const AuthController = require("/controllers/auth");

module.exports = router;

// api/auth/sign-up
router.post(
  routesByName.auth.signUp,
  [
    check("email", "Invalid email").isEmail(),
    check("password", "Invalid password").isLength({ min: 8 }),
  ],
  checkValidMiddleware,
  AuthController.signUp
);

// api/auth/login
router.post(
  routesByName.auth.signIn,
  [
    check("email", "Invalid email").normalizeEmail().isEmail(),
    check("password", "Invalid password").exists(),
  ],
  checkValidMiddleware,
  AuthController.signIn
);
