const { Schema, model, Types } = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const UserSchema = new Schema({
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  telegramChatId: { type: Number, default: null },
  dateCreated: { type: Date, default: Date.now },
});

UserSchema.plugin(autoIncrement.plugin, { model: "User", startAt: 1 });

module.exports = model("User", UserSchema);
