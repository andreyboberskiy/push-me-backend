process.env.NTBA_FIX_319 = 1; // Need for tel fix

const TelegramBot = require("node-telegram-bot-api");

const token = process.env.TELEGRAM_API;

class TelegramService {
  constructor() {
    this.bot = new TelegramBot(token, { polling: true });
  }

  async listenConnect() {
    this.bot.on("message", ({ text, chat }) => {
      if (text === "/start") {
        this.bot.sendMessage(
          chat.id,
          `This is our chat id: *${chat.id}*. Use it for connect your telegram to account in PushMe <3`,
          { parse_mode: "Markdown" }
        );
      }
    });
  }

  async pushMessage(chatId, message) {
    await this.bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
  }

  async notifyByParseTemplate({ chatId, template, list }) {
    const valuesQueryArr = list.map(({ title, value }) => {
      return `*${title} :* ${value}`;
    });

    const valuesQuery = valuesQueryArr.join("\n");

    const message = `Hey! I push you. Check Push.me to watch new updates.\n\n*Title:* ${template.title}\n\n${valuesQuery}`;

    console.log({ message });

    await this.pushMessage(chatId, message);
  }
}

module.exports = new TelegramService();
