const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Not Authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT);

    req.body.userId = decoded.userId;
    req.body.telegramChatId = decoded.telegramChatId;

    next();
  } catch (e) {
    return res.status(401).json({ message: "Not Authorized" });
  }
};
