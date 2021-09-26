// models
const ParseTemplateModel = require("/models/Template");
const NotificationModel = require("/models/Notification");

// services
const ParserService = require("/services/parser");
const NotificationService = require("/services/notification");

class TemplateService {
  async checkUpdates(templateId) {
    const template = await ParseTemplateModel.findById(templateId);

    const parsedList = await ParserService.parseTemplate(template);

    return false;

    const lastNotify = await NotificationModel.findById(templateId, "", {
      sort: { dateCreated: -1 },
      limit: 1,
    });

    if (!lastNotify.length) {
      await NotificationService.pushNotify(
        template,
        parsedList,
        telegramChatId
      );
      return false;
    }

    const isOldValues = await this.compareParsedValues(
      parsedList,
      lastNotify[0].parsedList
    );

    console.log("telegramChatId", telegramChatId);

    if (!isOldValues) {
      await NotificationService.pushNotify(
        template,
        parsedList,
        telegramChatId
      );
      return parsedList;
    }

    return false;
  }
}

module.exports = new TemplateService();
