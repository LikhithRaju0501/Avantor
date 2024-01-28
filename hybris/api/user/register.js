const express = require("express");
const bcrypt = require("bcryptjs");
const UserModel = require("./UserModel");
const shippingOptionsModel = require("../shippingOptions/shippingOptionsModel");
const { offersHandler } = require("../offers/offer");

var router = express.Router();

router.post("/", async (req, res) => {
  const { username, email, password, address } = req?.body;

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

      const userResult = await user.save();

      const userAddress = new shippingOptionsModel({
        userId: user?._id,
        addresses: [{ ...address, isDefault: true }],
      });
      const addressResult = await userAddress.save();

      res.status(201).json({
        message: "User registered successfully, Default Address Added",
      });
      try {
        await offersHandler(
          { ...req, userId: String(userResult?._id) },
          res,
          false
        );
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Error registering user" });
    }
  }
});

module.exports = router;
