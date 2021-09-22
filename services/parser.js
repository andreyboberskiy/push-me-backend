const HTMLParser = require("node-html-parser");
const needle = require("needle");

// exceptions
const ApiError = require("/exceptions/api-error");

class ParserService {
  async parseURL(url) {
    try {
      const encodedURI = encodeURI(url);
      const res = await needle("get", encodedURI, { compressed: true });

      const DOM = HTMLParser.parse(res.body, {
        blockTextElements: {
          pre: true,
        },
      });

      return DOM;
    } catch (e) {
      throw ApiError.BadRequest("Cant parse this url", [e]);
    }
  }
  async parseByParseTemplate(template) {
    try {
      const { url, selectorsData } = template;

      selectorsData.getFrom = 1;

      const DOM = await this.parseURL(url);

      if (!DOM) {
        throw ApiError.NotFound(
          `Cant found by this selector: ${selectorsData.parent}. Func: parseByParseTemplate`
        );
      }

      const allParsedElements = DOM?.querySelectorAll(selectorsData.parent);

      if (!allParsedElements.length) {
        throw ApiError.NotFound(
          `Cant found by this selector: ${selectorsData.parent}. Func: parseByParseTemplate`
        );
      }

      const parent =
        selectorsData.getFrom === -1
          ? allParsedElements[allParsedElements.length - 1]
          : allParsedElements[selectorsData.getFrom - 1];

      const textElementsBySelectors = selectorsData.selectors.map(
        (selector) => {
          const parsedText =
            parent
              .querySelector(selector.value)
              ?.textContent.replace(/\s+/g, " ")
              .trim() || false;
          return { title: selector.title, value: parsedText };
        }
      );

      return textElementsBySelectors;
    } catch (e) {
      throw ApiError.NotFound(` Func: parseByParseTemplate`, e);
    }
  }

  parseLastItemsWithWrapper(parseUrl, selectorsData) {
    return new Promise((resolve, reject) => {
      try {
        needle.get(parseUrl, { compressed: true }, function (err, res) {
          if (err) {
            reject(err);
          }
          const parsedInfo = [];

          const DOM = HTMLParser.parse(res.body, {
            blockTextElements: {
              pre: true,
            },
          });

          // fs.writeFile("./parseResult.txt", res.body, function (err, data) {});

          const { wrapper, selectorsWithLabel } = selectorsData;

          const wrappers = DOM.querySelectorAll(wrapper);

          if (!wrappers.length) {
            reject("Cant find any wrapper. Try another selector");
          }

          wrappers.forEach((wrapper) => {
            let preparedInfo = {};

            selectorsWithLabel.forEach(({ label, selector }) => {
              const selectorDOM = wrapper.querySelector(selector);

              if (selectorDOM) {
                preparedInfo = {
                  ...preparedInfo,
                  [label]:
                    selectorDOM.rawText.replace(/\s+/g, " ").trim() ||
                    "Not found",
                };
              }
            });
            parsedInfo.push(preparedInfo);
          });

          resolve({ parsedInfo, lengthOfW: wrappers.length });
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}

module.exports = new ParserService();
