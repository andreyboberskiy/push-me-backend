// models
const ParseTemplateModel = require("/models/ParseTemplate");

// services
const CronService = require("/services/cron");

// exceptions
const ApiError = require("/exceptions/api-error");

// DTO
const parseTemplateDTO = require("/dto/parseTemplate");

class ParseTemplatesController {
  async create(req, res, next) {
    try {
      const { title, url, selectorsData, userId, parseTime, enabled } =
        req.body;

      const sameTitle = await ParseTemplateModel.findOne({
        userId,
        title,
      });

      if (sameTitle) {
        throw ApiError.BadRequest("Invalid data", [
          { title: `Template with title ${title} is already exist` },
        ]);
      }

      const parseTemplate = await new ParseTemplateModel({
        title,
        url,
        selectorsData,
        userId,
        parseTime,
        enabled,
      });

      await parseTemplate.save();

      return res.status(201).json({ success: true });
    } catch (e) {
      next(e);
    }
  }

  async getList(req, res, next) {
    try {
      const { offset = 0, userId, sort } = req.body;

      const list = await ParseTemplateModel.find(
        { userId },
        [
          "title",
          "selectorsData",
          "url",
          "dateCreated",
          "enabled",
          "parseTime",
        ],
        {
          skip: offset || 0,
          limit: 10,
          sort: { dateCreated: sort === "newest" ? -1 : 1 },
        }
      );

      const listWithDTO = parseTemplateDTO.getTemplateAllDataByList(list);

      return res.status(200).json({ success: true, list: listWithDTO });
    } catch (e) {
      next(e);
    }
  }

  async turnParse(req, res, next) {
    try {
      const { id, enabled, parseTime } = req.body;

      const parseTemplate = await ParseTemplateModel.findById(id);

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

      await ParseTemplateModel.updateOne(
        { _id: id },
        { enabled, parseTime: parseTime || 0 }
      );

      return res.status(200).json({ success: true });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ParseTemplatesController();
