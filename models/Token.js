const { Schema, model } = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const TokenSchema = new Schema({
  userId: { type: Number, ref: "User" },
  refreshToken: { type: String, required: true },
});

TokenSchema.plugin(autoIncrement.plugin, { model: "Token", startAt: 1 });
module.exports = model("Token", TokenSchema);
