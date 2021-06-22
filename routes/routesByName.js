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
    lastItems: "/last-items",
  },
};

module.exports = routesByName;
