var express = require("express");
const authenticateToken = require("../middleware/middleware");
const UserModel = require("../user/UserModel");
var router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const { _id, password, ...user } = await UserModel.findById(
      req?.userId
    ).lean();
    if (user) {
      return res.status(200).json({
        ...user,
      });
    } else {
      return res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

module.exports = router;
