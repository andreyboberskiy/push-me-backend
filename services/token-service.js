const jwt = require("jsonwebtoken");
const TokenModel = require("/models/Token");
const ApiError = require("/exceptions/api-error");

class TokenService {
  async generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT, {
      expiresIn: "30d",
    });

    return { accessToken, refreshToken };
  }

  async saveToken(userId, refreshToken) {
    try {
      const tokenData = await TokenModel.findOne({ user: userId });
      if (tokenData) {
        tokenData.refreshToken = refreshToken;
        return await tokenData.save();
      }

      const token = TokenModel.create({ user: userId, refreshToken });

      return { token };
    } catch (e) {
      console.log(e);
      throw ApiError.BadRequest(400, "pep");
    }
  }
}

module.exports = new TokenService();
