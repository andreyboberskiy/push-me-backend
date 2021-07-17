const HTMLParser = require("node-html-parser");
const needle = require("needle");
const ApiError = require("/exceptions/api-error");
fs = require("fs");

class ParserService {
  async parseURL(url) {
    try {
      const res = await needle("get", url, { compressed: true });

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