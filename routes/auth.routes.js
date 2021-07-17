const { Router } = require("express");
const router = Router();
const { check } = require("express-validator");

const routesByName = require("/routes/routesByName");

// Controllers
const AuthController = require("/controllers/auth");

module.exports = router;

// api/auth/sign-up
router.post(
  routesByName.auth.signUp,
  [
    check("email", "Invalid email").isEmail(),
    check("password", "Invalid password").isLength({ min: 8 }),
  ],
  AuthController.signUp
);

// api/auth/login
router.post(
  routesByName.auth.signIn,
  [
    check("email", "Invalid email").normalizeEmail().isEmail(),
    check("password", "Invalid password").exists(),
  ],
  AuthController.signIn
);

// api/auth/
