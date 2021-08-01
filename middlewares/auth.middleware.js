const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1].slice(0, -1);

    if (!token) {
      return res.status(401).json({ message: "Not Authorized" });
    }

    console.log(token, process.env.JWT);
    const decoded = jwt.verify(token, process.env.JWT);

    req.body.userId = decoded.userId;
    req.body.telegramChatId = decoded.telegramChatId;

    next();
  } catch (e) {
    return res.status(401).json({ message: "Not Authorized" });
  }
};
