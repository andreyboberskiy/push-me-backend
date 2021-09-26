const { Schema, model, Types } = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  telegramChatId: { type: Number, default: null },
});

UserSchema.plugin(autoIncrement.plugin, { model: "User", startAt: 1 });

module.exports = model("User", UserSchema);
