const { Schema, model } = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const NotificationSchema = new Schema({
  templateId: { type: Number, ref: "ParseTemplate" },
  count: { type: Number, default: 0 },
  dateCreated: { type: Date, default: Date.now },
  parsedList: { type: Array, required: true },
});

NotificationSchema.plugin(autoIncrement.plugin, "Notification");

module.exports = model("Notification", NotificationSchema);
