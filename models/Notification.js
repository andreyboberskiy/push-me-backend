const { Schema, model } = require("mongoose");

const NotificationSchema = new Schema({
  template: { type: Schema.Types.ObjectId, ref: "ParseTemplate" },
  count: { type: Number, default: 0 },
  dateCreated: { type: Date, default: Date.now },
  parsedList: { type: Array, required: true },
});

module.exports = model("Notification", NotificationSchema);

NotificationSchema.pre("save", function (next) {
  this.count.increment();
  return next();
});
