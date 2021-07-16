const { validationResult } = require("express-validator");
const ApiError = require("/exceptions/api-error");

const ParseServices = require("/services/parser-services");
const { checkRouteValidation } = require("/services/validation-services");

function getElementsByText(str, DOM, tag = "a") {
  return Array.prototype.slice
    .call(DOM.getElementsByTagName(tag))
    .filter((el) => el.textContent.trim() === str.trim());
}

class ParserController {
  async byTextTemplate(req, res, next) {
    try {
      checkRouteValidation(req);

      const { url } = req.body;

      const DOM = await ParseServices.parseURL(url);

      const aTags = DOM.querySelectorAll("a");

      let result;

      aTags.forEach((tag) => {
        if (tag.textContent.includes("ВАЗ 2115 2007 1.6 газ бензин")) {
          result = tag;
          console.log("YES-------------");
        }
      });

      result = [...result.classList._set];

      return res
        .status(200)
        .json({ success: true, result: result ?? "no found" });
    } catch (e) {
      next(e);
    }
  }

  async lastItemsWrapper(req, res, next) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        throw ApiError.BadRequest("Invalid data", errors.array());
      }

      const { url, selectorsData } = req.body;

      const data = await ParseServices.parseLastItemsWithWrapper(
        url,
        selectorsData
      );

      return res.status(201).json({ ...data });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ParserController();
