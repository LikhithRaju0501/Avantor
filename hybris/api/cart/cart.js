var express = require("express");
const authenticateToken = require("../middleware/middleware");
const UserModel = require("../user/UserModel");
const cartModel = require("./cartModel");
const searchModel = require("../search/searchModel");
var router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { productId, quantity } = req?.body;
    const user = await UserModel.findById(req?.userId);
    const productData = await searchModel.findById(productId);
    const { product, description, supplier, _id } = productData;
    const getCart = await cartModel.findOne({ userId: req?.userId });
    let result;
    if (getCart) {
      //Cart Already exists
      const getEntry = await cartModel.findOne({
        entries: { $elemMatch: { productId } },
      });
      if (getEntry) {
        //Entry exists updating quantity

        result = await cartModel.updateOne(
          { "entries.productId": productId },
          { $set: { "entries.$.quantity": quantity } }
        );

        return res.status(201).json({
          message: "Cart, Entries exists, Updated quantity",
        });
      } else {
        //Cart exists, Added item
        result = await cartModel.findOneAndUpdate(
          { _id: getCart?._id },
          {
            $push: {
              entries: {
                product,
                description,
                supplier,
                productId: _id,
                quantity,
              },
            },
          },
          { new: true }
        );
        return res.status(201).json({
          message: "Cart exists, Added item",
        });
      }
    } else {
      //New Cart Created, Added item
      const cart = new cartModel({
        userId: user?._id,
        userName: user?.username,
        entries: [{ product, description, supplier, productId: _id, quantity }],
      });

      result = await cart.save();
      return res.status(201).json({
        message: "New Cart Created, Added item",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

module.exports = router;
