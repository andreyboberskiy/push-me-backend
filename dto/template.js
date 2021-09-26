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
  subscribers,
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
    subscribers,
  };
}

const template = {
  getTemplateAllData,
  getTemplateAllDataByList: (list) => {
    return map(list, (item) => getTemplateAllData(item));
  },
};

module.exports = template;
