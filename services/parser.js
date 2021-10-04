const HTMLParser = require("node-html-parser");
const needle = require("needle");
const { forEach, map } = require("lodash");

// exceptions
const ApiError = require("/exceptions/api-error");

// services
const DOMService = require("/services/dom");

class ParserService {
  async getDOM(url) {
    try {
      const encodedURI = encodeURI(url);
      const res = await needle("get", encodedURI, { compressed: true });

      const DOM = HTMLParser.parse(res.body, {
        blockTextElements: {
          pre: true,
        },
      });

      if (!DOM) {
        throw ApiError.NotFound(`Cant parse this url: ${url}`);
      }

      return DOM;
    } catch (e) {
      throw ApiError.NotFound("Cant parse this url", [e]);
    }
  }
  async parseTemplate(template) {
    try {
      const { url, selectorsData } = template;
      const DOM = await this.getDOM(url);

      const allParentNodes = DOM.querySelectorAll(selectorsData.parent);
      if (!allParentNodes.length) {
        throw ApiError.NotFound(
          `Could not find elements by this parent selector: ${selectorsData.parent}`
        );
      }
      // remove excludes selectors
      const filteredParents = [];
      const excludedSelectors = [];

      forEach(selectorsData.selectors, (item) => {
        forEach(item.excludedSelectors, (sel) => excludedSelectors.push(sel));
      });

      forEach(allParentNodes, (node) => {
        let hasExcludedNode = false;
        forEach(excludedSelectors, (excludedSelector) => {
          if (node.querySelector(excludedSelector)) {
            hasExcludedNode = true;
          }
        });
        if (!hasExcludedNode) {
          filteredParents.push(node);
        }
      });

      // Take newest item
      const parent = filteredParents[0];
      const templateNewestValues = map(
        selectorsData.selectors,
        ({ selector, title }) => {
          forEach(filteredParents, (par) => {
            const parNode = par.querySelector(selector);
            console.log(DOMService.getTextByNode(parNode));
          });

          const node = parent.querySelector(selector);
          const text = DOMService.getTextByNode(node);

          return { title, text };
        }
      );
      // console.log(DOMService.getTextsByNodes(filteredParents));
      console.log({ templateNewestValues });

      return templateNewestValues;
    } catch (e) {
      throw ApiError.NotFound(`Error. Func: parseByParseTemplate`, [e]);
    }
  }

  // parseLastItemsWithWrapper(parseUrl, selectorsData) {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       needle.get(parseUrl, { compressed: true }, function (err, res) {
  //         if (err) {
  //           reject(err);
  //         }
  //         const parsedInfo = [];
  //
  //         const DOM = HTMLParser.parse(res.body, {
  //           blockTextElements: {
  //             pre: true,
  //           },
  //         });
  //
  //         // fs.writeFile("./parseResult.txt", res.body, function (err, data) {});
  //
  //         const { wrapper, selectorsWithLabel } = selectorsData;
  //
  //         const wrappers = DOM.querySelectorAll(wrapper);
  //
  //         if (!wrappers.length) {
  //           reject("Cant find any wrapper. Try another selector");
  //         }
  //
  //         wrappers.forEach((wrapper) => {
  //           let preparedInfo = {};
  //
  //           selectorsWithLabel.forEach(({ label, selector }) => {
  //             const selectorDOM = wrapper.querySelector(selector);
  //
  //             if (selectorDOM) {
  //               preparedInfo = {
  //                 ...preparedInfo,
  //                 [label]:
  //                   selectorDOM.rawText.replace(/\s+/g, " ").trim() ||
  //                   "Not found",
  //               };
  //             }
  //           });
  //           parsedInfo.push(preparedInfo);
  //         });
  //
  //         resolve({ parsedInfo, lengthOfW: wrappers.length });
  //       });
  //     } catch (e) {
  //       reject(e);
  //     }
  //   });
  // }
}

module.exports = new ParserService();
