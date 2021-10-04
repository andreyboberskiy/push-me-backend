const apiPrefix = "/api";
const authPrefix = "/auth";
const parsePrefix = "/parse";
const templatesPrefix = "/templates";
const notificationsPrefix = "/notifications";
const userPrefix = "/user";

const routesByName = {
  prefix: apiPrefix,
  auth: {
    index: `${apiPrefix}${authPrefix}`,
    signIn: `/sign-in`,
    signUp: `/sign-up`,
    refreshToken: `/refresh-token`,
  },
  parse: {
    index: `${apiPrefix}${parsePrefix}`,
    byHTMLSelector: "/by-html-selector",
    byTextQuery: "/by-text-query",
    byHTMLSelectorWithPage: "/by-html-selector-with-page",
    byTextQueryWithPage: "/by-text-query-with-page",
  },
  templates: {
    index: `${apiPrefix}${templatesPrefix}`,
    create: "/create",
    list: "/list",
    turnParseEnabled: "/turn-parse",
    subscribe: "/subscribe",
    unsubscribe: "/unsubscribe",
    getTemplate: "/:id",
  },
  user: {
    index: `${apiPrefix}${userPrefix}`,
    getUser: ``,
    addTelegramId: "/add-telegram-id",
  },
  notifications: {
    index: `${apiPrefix}${notificationsPrefix}`,
    checkUpdatesNow: "/check-updates-now",
    getList: "/get-list",
  },
};

module.exports = routesByName;
