// models
const UserModel = require("/models/User");
const NotificationModel = require("/models/Notification");
const ParseTemplateModel = require("/models/ParseTemplate");

// services
const NotificationService = require("/services/notification");
const TokenService = require("/services/token");

//exceptions
const ApiError = require("/exceptions/api-error");

class NotificationController {
  async addTelegram(req, res, next) {
    try {
      const { chatId, userId } = req.body;

      const user = await UserModel.findByIdAndUpdate(userId, {
        telegramChatId: chatId,
      });

      const { refreshToken } = await TokenService.generateTokens({
        userId,
        telegramChatId: chatId,
      });

      await TokenService.saveToken(userId, refreshToken);

      return res.status(200).json({ success: true });
    } catch (e) {
      next(e);
    }
  }

  async getListByTemplate(req, res, next) {
    try {
      const { id, offset, sort } = req.body;

      const list = await NotificationModel.findById(
        id,
        {},
        {
          skip: offset,
          sort: { dateCreated: sort === "newest" ? -1 : 1 },
          limit: 10,
        }
      );

      return res.status(200).json({ notifications: list });
    } catch (e) {
      next(e);
    }
  }

  async checkUpdatesNow(req, res, next) {
    try {
      const { id, telegramChatId } = req.body;

      const template = await ParseTemplateModel.findOne({ _id: id });

      if (!template) {
        throw ApiError.NotFound("Template is not found");
      }

      const list = await NotificationService.checkUpdates(template, {
        telegramChatId,
      });

      return res.status(200).json({ parsedData: list });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new NotificationController();
