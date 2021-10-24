const { Schema, model } = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const mongoose = require("mongoose");

const TemplateSchema = new Schema({
  creatorId: { type: Number, ref: "User" },
  title: { type: String, required: true },
  working: { type: Boolean, required: true, default: false },
  parseTime: { type: Object, required: true, default: null },
  url: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now },
  subscribers: { type: [Number], required: true },
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
TemplateSchema.plugin(autoIncrement.plugin, { model: "Template", startAt: 1 });

module.exports = model("Template", TemplateSchema);
