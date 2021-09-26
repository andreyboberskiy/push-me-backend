const HTMLParser = require("node-html-parser");
const needle = require("needle");

// exceptions
const ApiError = require("/exceptions/api-error");

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

      const allParsedElements = DOM.querySelectorAll(selectorsData.parent);

      if (!allParsedElements.length) {
        throw ApiError.NotFound(
          `Could not find elements by this parent selector: ${selectorsData.parent}`
        );
      }

      // Take newest item
      const parent = allParsedElements[0];
      console.log({ parent, allParsedElements, selectorsData, url });

      const textElementsBySelectors = selectorsData.selectors.map(
        ({ selector, title }) => {
          const parsedText =
            parent
              .querySelector(selector)
              ?.textContent.replace(/\s+/g, " ")
              .trim() || false;
          return { title, value: parsedText };
        }
      );

      return textElementsBySelectors;
    } catch (e) {
      throw ApiError.NotFound(`Error. Func: parseByParseTemplate`, e);
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
