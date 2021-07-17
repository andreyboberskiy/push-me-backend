require("sexy-require");
const express = require("express");
const mongoose = require("mongoose");

const errorsMiddleware = require("/middlewares/error.middleware");

const dotenv = require("dotenv");
dotenv.config();

const routesByName = require("/routes/routesByName");

const app = express();

app.use(express.json({ extended: true }));

app.use(routesByName.auth.index, require("/routes/auth.routes"));
app.use(routesByName.parse.index, require("/routes/parser.routes"));
app.use(
  routesByName.parseTemplates.index,
  require("/routes/parseTemplates.routes")
);
app.use(errorsMiddleware);

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await mongoose.connect(process.env.MONGOOSE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log("Server Error", e.message);
    process.exit(1);
  }
}

start();
