require("sexy-require");
const express = require("express");
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer();

// configs
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 5000;
const routesByName = require("/constants/routesByName");

// middlewares
const errorsMiddleware = require("/middlewares/error.middleware");
const requestLimitMiddleware = require("/middlewares/requestLimit");

// services
const CronService = require("/services/cron");
const TelegramService = require("/services/telegram");

const app = express();

app.use(express.json({ extended: true }));
app.use(upload.array());

app.use(requestLimitMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({ extended: true }));
// routes
app.use(routesByName.auth.index, require("/routes/auth/auth.routes"));
app.use(routesByName.parse.index, require("/routes/parser/parser.routes"));
app.use(
  routesByName.templates.index,
  require("/routes/templates/templates.routes")
);
app.use(
  routesByName.notifications.index,
  require("/routes/notifications/notifications.routes")
);
app.use(routesByName.user.index, require("/routes/user/user.routes"));
//
// // /routes-for-test
app.use("/api/routes-for-test", require("/routes/test"));

// use middlewares
app.use(errorsMiddleware);

async function start() {
  try {
    await mongoose.connect(process.env.MONGOOSE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    mongoose.set("useFindAndModify", false);

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    await CronService.startAll();
    await TelegramService.listenConnect();
  } catch (e) {
    console.log("Server Error CRASH", e.message);
    process.exit(1);
  }
}

start();
