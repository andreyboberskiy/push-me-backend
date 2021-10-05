// models
const UserModel = require("/models/User");

// services
const TokenService = require("/services/token");

// DTO
const UserDTO = require("/dto/user");

// errors
const ApiError = require("/exceptions/api-error");

class UserController {
  async addTelegramId(req, res, next) {
    try {
      const { id: chatId, userId } = req.body;

      const user = await UserModel.findById(userId);

      user.telegramChatId = chatId;
      user.save();

      const { refreshToken } = await TokenService.generateTokens({
        userId,
        telegramChatId: chatId,
      });

      await TokenService.saveToken(userId, refreshToken);

      return res
        .status(200)
        .json({ chatId, refreshToken, user: UserDTO.getUserData(user) });
    } catch (e) {
      next(e);
    }
  }
  async getUser(req, res, next) {
    try {
      const { userId } = req.body;

      const user = await UserModel.findById(userId);

      if (!user) {
        throw ApiError.BadRequest("User not found");
      }

      return res.status(200).json({ user: UserDTO.getUserData(user) });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
