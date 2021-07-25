const bcrypt = require("bcryptjs");

// exceptions
const ApiError = require("/exceptions/api-error");

// models
const UserModel = require("/models/User");

// services
const TokenService = require("/services/token-service");

class AuthController {
  async signUp(req, res, next) {
    try {
      const { email, password } = req.body;
      const candidate = await UserModel.findOne({ email });

      if (candidate) {
        return res.status(400).json({
          message: "Sign up failed",
          validation: { email: "User with this email already exist" },
        });
      }

      const hashedPass = await bcrypt.hash(password, 2);
      const user = new UserModel({ email, password: hashedPass });

      await user.save();
      return res.status(201).json({ message: "User created" });
    } catch (e) {
      next(e);
    }
  }

  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findOne({ email });
      if (!user) {
        throw ApiError.BadRequest("User not found");
      }

      const isMatch = bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw ApiError.BadRequest("Password Incorrect");
      }

      const { accessToken, refreshToken } = await TokenService.generateTokens({
        userId: user._id,
        telegramChatId: user.telegramChatId || null,
      });

      await TokenService.saveToken(user._id, refreshToken);

      return res.status(200).json({ accessToken, refreshToken });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new AuthController();
