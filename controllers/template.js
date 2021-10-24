const { filter } = require("lodash");

// models
const TemplateModel = require("/models/Template");

// services
const CronService = require("/services/cron");
const TemplateService = require("/services/template");

// exceptions
const ApiError = require("/exceptions/api-error");

// DTO
const TemplateDTO = require("/dto/template");

class TemplateController {
  async getTemplate(req, res, next) {
    try {
      const { id } = req.params;
      const { userId } = req.body;

      const template = await TemplateService.getTemplateById(id, userId);

      return res.status(200).json(template);
    } catch (e) {
      next(e);
    }
  }
  async create(req, res, next) {
    try {
      const { title, url, selectorsData, userId, parseTime, enabled } =
        req.body;

      const sameTitle = await TemplateModel.findOne({
        userId,
        title,
      });

      if (sameTitle) {
        throw ApiError.BadRequest("Invalid data", [
          { title: `Template with title ${title} is already exist` },
        ]);
      }

      const templateData = {
        title,
        url: decodeURI(url),
        selectorsData,
        creatorId: userId,
        parseTime,
        working: enabled,
        subscribers: enabled ? [userId] : [],
      };

      const template = await TemplateService.create(templateData);

      const templateDTO = TemplateDTO.getTemplateAllData(template);

      return res.status(201).json({ success: true, template: templateDTO });
    } catch (e) {
      next(e);
    }
  }

  async getMyList(req, res, next) {
    try {
      const { offset = 0, userId, sort } = req.body;

      const list = await TemplateModel.find({ creatorId: userId }, [], {
        skip: offset || 0,
        limit: 10,
        sort: { dateCreated: sort === "newest" ? -1 : 1 },
      });

      const listWithDTO = TemplateDTO.getTemplateAllDataByList(list, userId);

      return res.status(200).json({ success: true, list: listWithDTO });
    } catch (e) {
      next(e);
    }
  }

  async turnEnabled(req, res, next) {
    try {
      const { id, enabled, userId } = req.body;

      const template = await TemplateService.getTemplateById(id);
      let userTemplate = await TemplateService.getTemplateById(id, userId);

      if (enabled && !userTemplate.enabled) {
        if (!template.working) {
          CronService.addForNotify(template);
          template.working = true;
          template.subscribers = [...template.subscribers, userId];
        } else {
          template.subscribers = [...template.subscribers, userId];
        }
      }
      if (!enabled) {
        template.subscribers = template.subscribers.filter(
          (id) => id !== userId
        );

        if (template.subscribers.length === 0) {
          CronService.stop(id);
          template.working = false;
        }
      }
      await template.save();

      userTemplate = await TemplateService.getTemplateById(id, userId);

      return res.status(200).json(userTemplate);
    } catch (e) {
      next(e);
    }
  }
  async updateImage(req, res, next) {
    try {
      console.log("LEL");
      console.log({ req });

      return res.status(200).json({});
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new TemplateController();
