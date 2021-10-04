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

      return res.status(200).json({ template });
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
        enabled,
        subscribers: [],
      };

      const template = await TemplateService.create(templateData);

      const templateDTO = TemplateDTO.getTemplateAllData(template);

      return res.status(201).json({ success: true, template: templateDTO });
    } catch (e) {
      next(e);
    }
  }

  async getList(req, res, next) {
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
      const { id, enabled, parseTime } = req.body;

      const parseTemplate = await TemplateModel.findById(id);

      if (!parseTemplate) {
        throw ApiError.BadRequest("Cant find template with this id");
      }

      if (enabled && !parseTemplate.enabled) {
        CronService.add(id, CronService.getTime(parseTime), () => {});
      }
      if (!enabled && parseTemplate.enabled) {
        CronService.stop(id);
      }
      if (!enabled && parseTemplate.enabled) {
        CronService.stop(id);
      }

      await TemplateModel.updateOne(
        { _id: id },
        { enabled, parseTime: parseTime || 0 }
      );

      return res.status(200).json({ success: true });
    } catch (e) {
      next(e);
    }
  }
  async subscribe(req, res, next) {
    try {
      const { id: templateId, userId } = req.body;

      const template = await TemplateService.getTemplateById(templateId);

      const isAlreadySubscribed = template.subscribers.includes(userId);

      if (isAlreadySubscribed) {
        throw ApiError.BadRequest("User already subscribed on this template");
      }

      CronService.addForNotify(template);
      await TemplateModel.updateOne(
        { _id: templateId },
        { subscribers: [...template.subscribers, userId], enabled: true }
      );
      return res.status(200).json({ success: true });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new TemplateController();
