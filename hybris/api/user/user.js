const express = require("express");
const bcrypt = require("bcryptjs");
const UserModel = require("./UserModel");

var router = express.Router();

router.post("/", async (req, res) => {
  const { username, email, password } = req?.body;

  const isUser = await UserModel.findOne({ email });
  if (isUser)
    return res
      .status(403)
      .json({ message: "User already exists, please login" });
  else {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new UserModel({
        username,
        email,
        password: hashedPassword,
      });

      const result = await user.save();

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Error registering user" });
    }
  }
});

module.exports = router;
