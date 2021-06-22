const HTMLParser = require("node-html-parser");
const needle = require("needle");
fs = require("fs");

module.exports.parseLastItems = (parseUrl, selectors) =>
  new Promise((resolve, reject) => {
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

        const wrappers = DOM.querySelectorAll(selectors.wrapper);

        if (!wrappers.length) {
          reject("Cant find any wrapper. Try another selector");
        }

        wrappers.forEach((wrapper) => {
          let preparedInfo = {};

          selectors.metaInfo.forEach(({ label, selector }) => {
            const selectorDOM = wrapper.querySelector(selector);
            if (selectorDOM) {
              if (label === "Title") {
                console.log(selectorDOM.childNodes);
              }
              preparedInfo = {
                ...preparedInfo,
                [label]:
                  selectorDOM.rawText.replace(/\s+/g, " ").trim() ||
                  "Not found",
              };
              // preparedInfo = {
              //   ...preparedInfo,
              //   [label]: selectorDOM.structure,
              // };
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
