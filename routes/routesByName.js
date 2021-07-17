const apiPrefix = "/api";
const authPrefix = "/auth";
const parsePrefix = "/parse";
const parseTemplatesPrefix = "/parse-templates";

const routesByName = {
  prefix: apiPrefix,
  auth: {
    index: `${apiPrefix}${authPrefix}`,
    signIn: `/sign-in`,
    signUp: `/sign-up`,
  },
  parse: {
    index: `${apiPrefix}${parsePrefix}`,
    byHTMLSelector: "/by-html-selector",
    byTextQuery: "/by-text-query",
    byHTMLSelectorWithPage: "/by-html-selector-with-page",
    byTextQueryWithPage: "/by-text-query-with-page",
  },
  parseTemplates: {
    index: `${apiPrefix}${parseTemplatesPrefix}`,
    create: "/create",
    list: "/list",
  },
};

module.exports = routesByName;
