const { Schema, model } = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const mongoose = require("mongoose");

const ParseTemplateSchema = new Schema({
  userId: { type: Number, ref: "User" },
  title: { type: String, required: true },
  enabled: { type: Boolean, required: true, default: false },
  parseTime: { type: Object, required: true, default: null },
  url: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now },
  selectorsData: {
    parent: { type: String, required: true },
    selectors: [
      {
        title: { type: String, required: true },
        selector: { type: String, required: true },
        excludedSelectors: { type: Array, required: false },
      },
    ],
  },
});

autoIncrement.initialize(mongoose.connection);
ParseTemplateSchema.plugin(autoIncrement.plugin, "ParseTemplate");

module.exports = model("ParseTemplate", ParseTemplateSchema);
