const express = require("express");
const bcrypt = require("bcryptjs");
const UserModel = require("./UserModel");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
require("dotenv").config();

var router = express.Router();

router.post("/", async (req, res) => {
  const { userId, newPassword } = req?.body;
  try {
    if (mongoose.Types.ObjectId.isValid(userId)) {
      const user = await UserModel.findById(userId);
      if (user) {
        const passwordMatch = await bcrypt.compare(newPassword, user?.password);
        if (passwordMatch) {
          return res.status(400).json({
            message:
              "The New Password has to be different from Existing Password",
          });
        } else {
          const { _id } = user;
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          result = await UserModel.updateOne(
            { _id },
            {
              $set: {
                password: hashedPassword,
              },
            }
          );
          return res.status(201).json({
            message: "Password Updated Successfully",
          });
        }
      } else {
        return res
          .status(404)
          .json({ message: "No User with Email ID exists" });
      }
    } else {
      return res.status(404).json({ message: "No User with Email ID exists" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error during login" });
  }
});

router.post("/email", async (req, res) => {
  const { email, baseSite } = req?.body;
  try {
    const user = await UserModel.findOne({ email }).lean();
    if (user) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.ADMINMAILID,
          pass: process.env.ADMINMAILPASSWORD,
        },
      });
      const mailOptions = {
        from: "Ammijan",
        subject: "Reset Password - Ammijan",
        html: `
        <html>
        <h1>Yo, Please find below the link to reset your password.</h1>
        <a href="${
          baseSite + "/reset-password?userId=" + user?._id
        }">Please Reset your Password Here</a>
        </html>
        `,
      };
      mailOptions.to = email;
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(`Error sending email to ${email}:`, error);
          return res.status(500).json({
            message:
              "We couldn't send the reset password mail, Please try again later.",
          });
        } else {
          console.log(`Email sent successfully to ${email}:`, info.response);
          return res.status(201).json({
            message: "You will soon receive a mail to reset your password",
          });
        }
      });
    } else {
      return res.status(404).json({ message: "No User with Email ID exists" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong, Please try again later" });
  }
});

module.exports = router;
