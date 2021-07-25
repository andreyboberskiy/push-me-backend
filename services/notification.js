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
      template: template.id,
      parsedList: list,
    });
    await newNotification.save();

    console.log("Notified");
  }
  async compareParsedValues(newList, prevList) {
    return isEqual(newList, prevList);
  }
  async checkUpdates(template, { telegramChatId }) {
    const parsedList = await ParserService.parseByParseTemplate(template);

    const lastNotify = await NotificationModel.find(
      {
        template: template.id,
      },
      "",
      { sort: { dateCreated: -1 }, limit: 1 }
    );

    if (!lastNotify.length) {
      await this.pushNotify(template, parsedList, telegramChatId);
      return false;
    }

    const isOldValues = await this.compareParsedValues(
      parsedList,
      lastNotify[0].parsedList
    );

    console.log("telegramChatId", telegramChatId);

    if (!isOldValues) {
      await this.pushNotify(template, parsedList, telegramChatId);
      return parsedList;
    }

    return false;
  }
}

module.exports = new NotificationService();
