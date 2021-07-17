const { checkRouteValidation } = require("/services/validation-services");
const ParseTemplateModel = require("/models/ParseTemplate");
const ApiError = require("/exceptions/api-error");

class ParseTemplatesController {
  async create(req, res, next) {
    try {
      checkRouteValidation(req);

      const {
        title,
        url,
        selectorsData,
        userId,
        parseTime,
        enabled,
      } = req.body;

      const sameTitle = await ParseTemplateModel.findOne({
        user: userId,
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
        user: userId,
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
      checkRouteValidation(req);

      const { offset, userId } = req.body;

      const list = await ParseTemplateModel.find({ user: userId }).limit(
        offset || 0
      );

      console.log(list);

      return res.status(201).json({ success: true, list });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ParseTemplatesController();
