const { Schema, model } = require("mongoose");

const ParseTemplateSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  enabled: { type: Boolean, required: true, default: false },
  parseTime: { type: Number, required: true, default: 0 },
  url: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now },
  selectorsData: {
    parent: { type: String, required: true },
    selectors: [
      {
        title: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
  },
});

module.exports = model("ParseTemplate", ParseTemplateSchema);
