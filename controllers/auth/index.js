const { validationResult } = require("express-validator");
const User = require("/models/User");
const jwt = require("jsonwebtoken");
const routesByName = require("/routes/routesByName");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

AuthController = {
  async signUp(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: errors.array(), message: "Invalid data" });
      }

      const { email, password } = req.body;
      const candidate = await User.findOne({ email });

      if (candidate) {
        return res.status(400).json({
          message: "Sign up failed",
          validation: { email: "User with this email already exist" },
        });
      }

      const hashedPass = await bcrypt.hash(password, 2);
      const user = new User({ email, password: hashedPass });

      await user.save();
      return res.status(201).json({ message: "User created" });
    } catch (e) {
      res.status(500).json({
        message: "Internal Server Error",
        error: e,
        route: routesByName.auth.signUp,
      });
    }
  },

  async signIn(req, res) {
    try {
      const errors = validationResult(req);
      console.log(req.body);

      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: errors.array(), message: "Invalid data" });
      }
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const isMatch = bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Password incorrect" });
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT, {
        expiresIn: "1h",
      });

      return res.status(200).json({ token });
    } catch (e) {
      res.status(500).json({
        message: "Internal Server Error",
        error: e,
        route: routesByName.auth.signIn,
      });
    }
  },
};

module.exports = AuthController;
