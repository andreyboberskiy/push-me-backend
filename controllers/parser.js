// exceptions
const ApiError = require("/exceptions/api-error");

// services
const ParseServices = require("/services/parser");
const DOMService = require("/services/dom");
const { map } = require("lodash");

class ParserController {
  async byTextQuery(req, res, next) {
    try {
      const { url, selectorQuery, approvedQueries } = req.body;

      const DOM = await ParseServices.parseURL(decodeURI(url));

      const node = DOMService.getNodeByText(DOM, selectorQuery);
      if (!node) {
        throw ApiError.NotFound("Cant find this text, try another");
      }

      const selector = DOMService.getNodeSelector(node);
      if (!selector) {
        throw ApiError.NotFound("Cant find selector text");
      }

      const sameNodes = DOM.querySelectorAll(selector);

      const sameInfo = map(sameNodes, (node, index) => {
        const text = DOMService.getTextByNode(node);
        const selector = DOMService.getSelectorByNode(node);

        return { text, selector, id: index + 1 };
      });

      const parent = DOMService.getParentSelector(node, approvedQueries);

      return res.status(200).json({ sameInfo, selector, parent });
    } catch (e) {
      next(e);
    }
  }

  async byHTMLSelector(req, res, next) {
    try {
      //selector = [".class1 .class2"] || ["#id1","#id"] etc
      const { url, selector } = req.body;

      const DOM = await ParseServices.parseURL(decodeURI(url));

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
      //selector = [".class1 .class2"] || ["#id1","#id"] etc
      const { url, secondPageUrl, pageCount, selector } = req.body;

      const stringDiff = secondPageUrl.split(decodeURI(url)).join("");

      if (!stringDiff.length) {
        throw ApiError.BadRequest("Cant find URL differences");
      }

      const numberOfPage = parseInt(stringDiff.replace(/[a-zA-Z,?.=]+/, ""));

      const reg = new RegExp(`/${numberOfPage}/gi`);

      for (let i = 0; i < pageCount; i++) {
        const currentUrl = `${url}${stringDiff.replace(reg, i + 1)}`;
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
