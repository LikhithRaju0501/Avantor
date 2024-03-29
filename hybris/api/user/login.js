const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("./UserModel");

var router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req?.body;
  try {
    const user = await UserModel.findOne({ email });

    if (!user)
      res.status(404).json({ message: "User doesn't exist, Please Register" });
    else {
      const passwordMatch = await bcrypt.compare(password, user?.password);
      if (passwordMatch) {
        const token = jwt.sign({ userId: user._id }, "your-secret-key", {
          expiresIn: "1h",
        });
        res.status(200).json({ message: "Login Successfull", token });
      } else
        res.status(401).json({ message: "Incorrect username or password" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error during login" });
  }
});

module.exports = router;
