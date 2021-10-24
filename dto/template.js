const map = require("lodash/map");

function getTemplateAllData(
  {
    _id,
    creatorId,
    title,
    enabled,
    working,
    parseTime,
    url,
    dateCreated,
    selectorsData,
    subscribers,
  },
  userId
) {
  return {
    id: _id,
    creatorId,
    isCreator: creatorId === userId,
    title,
    enabled: subscribers.includes(userId),
    parseTime,
    url,
    dateCreated,
    selectorsData,
    subscribers,
  };
}

const template = {
  getTemplateAllData,
  getTemplateAllDataByList: (list, userId) => {
    return map(list, (item) => getTemplateAllData(item, userId));
  },
};

module.exports = template;
