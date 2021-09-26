const isEqual = require("lodash/isEqual");

// services
const ParserService = require("/services/parser");
const TelegramService = require("/services/telegram");

// models
const NotificationModel = require("/models/Notification");

class NotificationService {
  async pushNotify(template, list, telegramChatId) {
    if (telegramChatId) {
      await TelegramService.notifyByParseTemplate({
        template,
        list,
        chatId: telegramChatId,
      });
    }

    const newNotification = await NotificationModel.create({
      templateId: template.id,
      parsedList: list,
    });
    await newNotification.save();

    console.log("Notified");
  }
  async compareParsedValues(newList, prevList) {
    return isEqual(newList, prevList);
  }
}

module.exports = new NotificationService();
