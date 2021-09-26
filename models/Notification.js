const { Schema, model } = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const NotificationSchema = new Schema({
  templateId: { type: Number, ref: "Template", required: true },
  count: { type: Number },
  selectorsValues: { type: Array, required: true },
  dateCreated: { type: Date, default: Date.now },
});

NotificationSchema.plugin(autoIncrement.plugin, {
  model: "Notification",
  startAt: 1,
});
NotificationSchema.plugin(autoIncrement.plugin, {
  model: "Notification",
  field: "count",
  startAt: 1,
});

module.exports = model("Notification", NotificationSchema);
