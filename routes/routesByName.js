const apiPrefix = "/api";
const authPrefix = "/auth";
const parsePrefix = "/parse";

const routesByName = {
  prefix: apiPrefix,
  auth: {
    index: `${apiPrefix}${authPrefix}`,
    signIn: `/sign-in`,
    signUp: `/sign-up`,
  },
  parse: {
    index: `${apiPrefix}${parsePrefix}`,
    lastItemsWrapper: "/last-items-wrapper",
    byTextTemplate: "/by-text-template",
  },
};

module.exports = routesByName;
