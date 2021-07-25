require("sexy-require");
const express = require("express");
const mongoose = require("mongoose");

// configs
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 5000;
const routesByName = require("/constants/routesByName");

// middlewares
const errorsMiddleware = require("/middlewares/error.middleware");

// services
const CronService = require("/services/cron");
const TelegramService = require("/services/telegram");

const app = express();

app.use(express.json({ extended: true }));

// routes
app.use(routesByName.auth.index, require("/routes/auth.routes"));
app.use(routesByName.parse.index, require("/routes/parser.routes"));
app.use(
  routesByName.parseTemplates.index,
  require("/routes/parseTemplates.routes")
);
app.use(
  routesByName.notifications.index,
  require("/routes/notifications.routes")
);

// use middlewares
app.use(errorsMiddleware);

async function start() {
  try {
    await mongoose.connect(process.env.MONGOOSE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    await CronService.startAll();
    await TelegramService.listenConnect();
  } catch (e) {
    console.log("Server Error CRASH", e.message);
    process.exit(1);
  }
}

start();
