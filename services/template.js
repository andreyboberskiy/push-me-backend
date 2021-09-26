// models
const TemplateModel = require("/models/Template");
const NotificationModel = require("/models/Notification");

// services
const ParserService = require("/services/parser");
const NotificationService = require("/services/notification");

// exceptions
const ApiError = require("/exceptions/api-error");

class TemplateService {
  async getTemplateById(id) {
    const template = await TemplateModel.findById(id);

    if (!template) {
      throw ApiError.NotFound(`Cant find template by this id ${id}`);
    }
    return template;
  }
  async checkUpdates(templateId) {
    const template = await this.getTemplateById(templateId);

    const parsedList = await ParserService.parseTemplate(template);

    return false;

    const lastNotify = await NotificationService.getLastNotification(
      templateId
    );

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
