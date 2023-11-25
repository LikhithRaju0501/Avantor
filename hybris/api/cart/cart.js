var express = require("express");
const { ObjectId } = require("mongodb");
const authenticateToken = require("../middleware/middleware");
const UserModel = require("../user/UserModel");
const cartModel = require("./cartModel");
const searchModel = require("../search/searchModel");
var router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  const user = await UserModel.findById(req?.userId);
  try {
    const cartDetails = await cartModel.findOne({ userId: req?.userId });
    return res.status(200).json({
      name: user?.username,
      entries: cartDetails?.entries || [],
      type: "cartWSDTO",
    });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

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
        const { quantity: quantityToUpdate } = getEntry?.entries?.find(
          (entry) => String(entry?.productId) === productId
        );
        result = await cartModel.updateOne(
          { _id: getCart?._id, "entries.productId": productId },
          {
            $set: {
              "entries.$.quantity": Number(quantity) + Number(quantityToUpdate),
            },
          }
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

router.delete("/", authenticateToken, async (req, res) => {
  try {
    const { productId } = req?.body;
    const cartDetails = await cartModel.findOne({ userId: req?.userId });
    if (!cartDetails) {
      return res.status(404).json({
        message: "Cart not found.",
        type: "cartWSDTO",
      });
    } else {
      let isEntryAvailable;
      const newEntries = cartDetails?.entries?.filter((item) => {
        isEntryAvailable = item?.productId?.equals(new ObjectId(productId));
        return !item?.productId?.equals(new ObjectId(productId));
      });

      if (newEntries?.length === 0) {
        const result = await cartModel.deleteOne({ _id: cartDetails?._id });
        return res.status(201).json({
          message: "Deleted Cart",
          type: "cartWSDTO",
        });
      } else {
        const result = await cartModel.updateOne(
          { _id: cartDetails?._id },
          { $set: { entries: [...newEntries] } }
        );
        return isEntryAvailable
          ? res.status(201).json({
              message: "Deleted Item",
              type: "cartWSDTO",
            })
          : res.status(404).json({
              message: "Item not found",
              type: "cartWSDTO",
            });
      }
    }
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

module.exports = router;
