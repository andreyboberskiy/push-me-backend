// models
const UserModel = require("/models/User");

// services
const TokenService = require("/services/token");

class UserController {
  async addTelegramId(req, res, next) {
    try {
      const { chatId, userId } = req.body;

      await UserModel.findOneAndUpdate(
        { _id: userId },
        {
          telegramChatId: chatId,
        }
      );

      const { refreshToken } = await TokenService.generateTokens({
        userId,
        telegramChatId: chatId,
      });

      await TokenService.saveToken(userId, refreshToken);

      return res.status(200).json({ chatId, refreshToken });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
