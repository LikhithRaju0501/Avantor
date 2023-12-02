var express = require("express");
const authenticateToken = require("../middleware/middleware");
const cartModel = require("../cart/cartModel");
const orderModel = require("./orderModel");
const UserModel = require("../user/UserModel");
var router = express.Router();
const moment = require("moment-timezone");

router.get("/", authenticateToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req?.userId);
    const userOrders = await orderModel.findOne({ userId: req?.userId });
    if (userOrders) {
      return res.status(200).json({
        ...userOrders?.toObject(),
        type: "OrderWSDTO",
      });
    } else {
      return res.status(200).json({
        userId: user?._id,
        userName: user?.username,
        orders: [],
        type: "OrderWSDTO",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});
router.post("/", authenticateToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req?.userId);
    const userCart = await cartModel.findOne({
      userId: req?.userId,
    });
    if (userCart) {
      const userOrders = await orderModel.findOne({
        userId: req?.userId,
      });
      const {
        entries,
        totalPrice,
        address,
        primaryEmailAddress,
        secondaryEmailAddress,
      } = userCart?.toObject();
      const order = {
        entries: [...entries] || [],
        totalPrice: { ...totalPrice } || {},
        address: { ...address } || {},
        emailAddresses: [primaryEmailAddress, ...secondaryEmailAddress] || [],
        numberOfItems: entries?.length || 0,
        orderStatus: "Placed",
        createdAt: moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss"),
      };
      if (userOrders) {
        result = await orderModel.findOneAndUpdate(
          { _id: userOrders?._id },
          {
            $push: {
              orders: { ...order },
            },
          },
          { new: true }
        );
        const deleteCart = await cartModel.deleteOne({ _id: userCart?._id });
        return res.status(201).json({
          message: "Orders exists, Added order",
        });
      } else {
        const currentOrder = new orderModel({
          userId: user?._id,
          userName: user?.username,
          orders: [{ ...order }],
        });

        result = await currentOrder.save();
        const deleteCart = await cartModel.deleteOne({ _id: userCart?._id });
        return res.status(201).json({
          message: "Created New Order",
        });
      }
    } else {
      return res.status(404).json({
        message: "Cart not found.",
      });
    }

    // console.log([...entries]);
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

module.exports = router;
