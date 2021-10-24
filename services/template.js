// models
const TemplateModel = require("/models/Template");

// services
const ParserService = require("/services/parser");
const NotificationService = require("/services/notification");

// DTO
const TemplateDTO = require("/dto/template");

// exceptions
const ApiError = require("/exceptions/api-error");

class TemplateService {
  async create(dataForModel) {
    const template = await new TemplateModel(dataForModel);

    await template.save();

    return template;
  }
  async getTemplateById(id, userId) {
    const template = await TemplateModel.findById(id);

    if (!template) {
      throw ApiError.NotFound(`Cant find template by this id ${id}`);
    }

    if (userId) {
      return TemplateDTO.getTemplateAllData(template, userId);
    }
    return template;
  }
  async checkUpdates(templateId) {
    const template = await this.getTemplateById(templateId);

    if (!template.subscribers.length) {
      template.enabled = false;
      await template.save();
    }

    const newestValues = await ParserService.parseTemplate(template);

    const lastNotification =
      await NotificationService.getLastTemplateNotification(templateId);

    if (!lastNotification) {
      await NotificationService.pushNotificationTemplate(template, {
        selectorsValues: newestValues,
      });
      return;
    }

    const notChanged = await NotificationService.compareSelectorsValuesOnEqual(
      lastNotification.selectorsValues,
      newestValues
    );

    if (!notChanged) {
      await NotificationService.pushNotificationTemplate(template, {
        selectorsValues: newestValues,
      });
      return;
    }

    return;
  }
}

module.exports = new TemplateService();
