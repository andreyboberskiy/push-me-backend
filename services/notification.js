const isEqual = require("lodash/isEqual");
const { map, forEach } = require("lodash");

// services
const TelegramService = require("/services/telegram");

// models
const NotificationModel = require("/models/Notification");
const UserModel = require("/models/User");

class NotificationService {
  // async pushNotify(template, list, telegramChatId) {
  //   if (telegramChatId) {
  //     await TelegramService.notifyByParseTemplate({
  //       template,
  //       list,
  //       chatId: telegramChatId,
  //     });
  //   }
  //
  //   const newNotification = await NotificationModel.create({
  //     templateId: template.id,
  //     parsedList: list,
  //   });
  //   await newNotification.save();
  //
  //   console.log("Notified");
  // }
  compareSelectorsValuesOnEqual(newValues, prevValues) {
    return isEqual(newValues, prevValues);
  }

  async getLastTemplateNotification(templateId) {
    const notify = await NotificationModel.find({ templateId }, "", {
      sort: { dateCreated: -1 },
      limit: 1,
    });

    if (notify?.length) {
      return notify[0];
    }

    return false;
  }

  getMessageByTemplateValues({ templateTitle, selectorsValues, url }) {
    const selectorsValuesText = map(selectorsValues, ({ title, text }) => {
      return `*${title}:* ${text}`;
    }).join("\n");

    const message =
      "Hey! I push you. Check PushMe.com to watch new updates.\n\n" +
      `*Title:* ${templateTitle}\n\n` +
      `${selectorsValuesText}\n\n` +
      `*Url:* ${url}`;

    return message;
  }

  async pushNotificationTemplate(template, { selectorsValues }) {
    const { subscribers, title: templateTitle, url, id: templateId } = template;

    const newNotification = await new NotificationModel({
      templateId,
      selectorsValues,
    });
    await newNotification.save();

    if (!subscribers?.length) return;

    const messageText = this.getMessageByTemplateValues({
      templateTitle,
      selectorsValues,
      url,
    });

    const allSubscribersData = await UserModel.find({
      _id: { $in: subscribers },
    });

    const allSubscribersTelegramIds = map(
      allSubscribersData,
      (user) => user.telegramChatId
    );

    forEach(allSubscribersTelegramIds, (id) => {
      TelegramService.pushMessage(id, messageText);
    });

    console.log("Notified");
  }
}

module.exports = new NotificationService();
