const { validationResult } = require("express-validator");
const ApiError = require("/exceptions/api-error");

const ParseServices = require("/services/parser");
const { checkRouteValidation } = require("/services/validation-services");

function getElementsByText(str, DOM, tag = "a") {
  return Array.prototype.slice
    .call(DOM.getElementsByTagName(tag))
    .filter((el) => el.textContent.trim() === str.trim());
}

class ParserController {
  async byTextQuery(req, res, next) {
    try {
      checkRouteValidation(req);

      const { url, selectorQuery } = req.body;

      const DOM = await ParseServices.parseURL(url);

      let finishTag;

      const tagsNameCanContainText = ["a", "span", "p", "div"];

      tagsNameCanContainText.forEach((tagName) => {
        if (finishTag) return;
        const parsedTagsFromDom = DOM.querySelectorAll(tagName);

        parsedTagsFromDom.forEach((tag) => {
          if (finishTag) return;
          if (tag.textContent.includes(selectorQuery)) {
            finishTag = tag;
          }
        });
      });

      if (!finishTag) {
        throw ApiError.NotFound("Cant find this text, try another");
      }

      const classList = finishTag.classList.value;

      const selectorForSame = `.${classList.join(".")}`;
      const sameTags = DOM.querySelectorAll(selectorForSame);
      const sameTexts = sameTags.map((item) =>
        item.textContent.replace(/\s+/g, " ").trim()
      );

      return res.status(200).json({ sameTexts, classList });
    } catch (e) {
      next(e);
    }
  }

  async byHTMLSelector(req, res, next) {
    try {
      checkRouteValidation(req);

      //selector = [".class1 .class2"] || ["#id1","#id"] etc
      const { url, selector } = req.body;

      const DOM = await ParseServices.parseURL(url);

      const allParsedElements = DOM.querySelectorAll(selector);

      if (!allParsedElements.length) {
        throw ApiError.NotFound("Cant found by this selector, try another");
      }

      const allElementsTexts = allParsedElements.map((item) =>
        item.textContent.replace(/\s+/g, " ").trim()
      );

      return res.status(200).json({ allElementsTexts, selector });
    } catch (e) {
      next(e);
    }
  }
  async byHTMLSelectorWithPage(req, res, next) {
    try {
      checkRouteValidation(req);

      //selector = [".class1 .class2"] || ["#id1","#id"] etc
      const { url, secondPageUrl, pageCount, selector } = req.body;

      const stringDiff = secondPageUrl.split(url).join("");

      if (!stringDiff.length) {
        throw ApiError.BadRequest("Cant find URL differences");
      }

      const numberOfPage = parseInt(stringDiff.replace(/[a-zA-Z,?.=]+/, ""));
      console.log({ numberOfPage });

      const reg = new RegExp(`/${numberOfPage}/gi`);

      console.log(stringDiff.replace(reg, 9));

      for (let i = 0; i < pageCount; i++) {
        const currentUrl = `${url}${stringDiff.replace(reg, i + 1)}`;
        console.log({ currentUrl });
      }

      // new Array(pageCount).fill("k").forEach((_, index) => {
      //
      //   urls.push(currentUrl);
      //   console.log("hello");
      //   console.log("ke11k", { currentUrl });
      // });

      //
      // const allParsedElements = DOM.querySelectorAll(selector);
      //
      // if (!allParsedElements.length) {
      //   throw ApiError.NotFound("Cant found by this selector, try another");
      // }
      //
      // const allElementsTexts = allParsedElements.map((item) =>
      //   item.textContent.replace(/\s+/g, " ").trim()
      // );

      return res.status(200).json({ isReady: false });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ParserController();
