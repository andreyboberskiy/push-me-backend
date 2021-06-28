const { validationResult } = require("express-validator");

const parseHandlers = require("./handlers");

module.exports = {
  lastItemsWrapper: async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: errors.array(), message: "Invalid data" });
      }

      const { url, selectorsData } = req.body;

      const data = await parseHandlers.parseLastItemsWithWrapper(
        url,
        selectorsData
      );

      return res.status(201).json({ ...data });
    } catch (e) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
