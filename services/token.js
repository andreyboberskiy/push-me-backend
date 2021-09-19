const jwt = require("jsonwebtoken");

// models
const TokenModel = require("/models/Token");

class Token {
  async generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT, {
      expiresIn: "30d",
    });

    return { accessToken, refreshToken };
  }

  async saveToken(userId, refreshToken, oldToken = null) {
    const tokenData = await TokenModel.findOne({ user: userId });
    if (tokenData && oldToken && tokenData.refreshToken === oldToken) {
      tokenData.refreshToken = refreshToken;
      return await tokenData.save();
    }

    const token = TokenModel.create({ userId, refreshToken });

    return { token };
  }
}

module.exports = new Token();
