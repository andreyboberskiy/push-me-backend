const { Schema, model } = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");

const TokenSchema = new Schema({
  userId: { type: Number, ref: "User" },
  refreshToken: { type: String, required: true },
});

TokenSchema.plugin(autoIncrement.plugin, "Token");
module.exports = model("Token", TokenSchema);
