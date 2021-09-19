const map = require("lodash/map");

function getTemplateAllData({
  _id,
  userId,
  title,
  enabled,
  parseTime,
  url,
  dateCreated,
  selectorsData,
}) {
  return {
    id: _id,
    userId,
    title,
    enabled,
    parseTime,
    url,
    dateCreated,
    selectorsData,
  };
}

const parseTemplate = {
  getTemplateAllData,
  getTemplateAllDataByList: (list) => {
    return map(list, (item) => getTemplateAllData(item));
  },
};

module.exports = parseTemplate;
