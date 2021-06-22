const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
require("sexy-require");

const routesByName = require("./routes/routesByName");

const app = express();

app.use(express.json({ extended: true }));

app.use(routesByName.auth.index, require("./routes/auth.routes"));
app.use(routesByName.parse.index, require("./routes/parser.routes"));

const PORT = config.get("port") || 5000;

async function start() {
  try {
    await mongoose.connect(config.get("mongoUri"), {
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
