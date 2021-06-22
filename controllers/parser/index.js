const parseHandlers = require("./handlers");
const { validationResult } = require("express-validator");

module.exports = {
  lastItems: async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: errors.array(), message: "Invalid data" });
      }

      const { url, selectors } = req.body;

      const data = await parseHandlers.parseLastItems(url, selectors);

      return res.status(201).json({ ...data });
    } catch (e) {
      res.status(500).json({ message: "Что-то пошло не так, сервер упал" });
    }
  },
};
