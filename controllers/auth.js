const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// exceptions
const ApiError = require("/exceptions/api-error");

// models
const UserModel = require("/models/User");

// services
const TokenService = require("/services/token");

//DTO
const UserDTO = require("/dto/user");

class AuthController {
  async signUp(req, res, next) {
    try {
      const { email, password, name, surname } = req.body;
      const candidate = await UserModel.findOne({ email });

      if (candidate) {
        return res.status(400).json({
          message: "Sign up failed",
          validation: { email: "User with this email already exist" },
        });
      }

      const hashedPass = await bcrypt.hash(password, 2);
      const user = new UserModel({
        email,
        password: hashedPass,
        name,
        surname,
      });

      await user.save();

      return res
        .status(201)
        .json({ message: "User created", user: UserDTO.getUserData(user) });
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

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw ApiError.BadRequest("Password Incorrect");
      }

      const { accessToken, refreshToken } = await TokenService.generateTokens({
        userId: user._id,
        telegramChatId: user.telegramChatId || null,
      });

      await TokenService.saveToken(user._id, refreshToken);

      return res
        .status(200)
        .json({ accessToken, refreshToken, user: UserDTO.getUserData(user) });
    } catch (e) {
      next(e);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken: oldToken } = req.body;

      const { userId, telegramChatId } = jwt.verify(oldToken, process.env.JWT);

      if (!userId) {
        throw ApiError.BadRequest("Token not found");
      }

      const user = await UserModel.findById(userId);

      if (!user) {
        throw ApiError.BadRequest("User not found");
      }

      const { accessToken, refreshToken } = await TokenService.generateTokens({
        userId,
        telegramChatId,
      });

      await TokenService.saveToken(userId, refreshToken, oldToken);

      return res
        .status(200)
        .json({ accessToken, refreshToken, user: UserDTO.getUserData(user) });
    } catch (e) {
      return res.status(401).json({ logout: true });
    }
  }
}

module.exports = new AuthController();
