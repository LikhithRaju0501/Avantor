var express = require("express");
const authenticateToken = require("../middleware/middleware");
const UserModel = require("../user/UserModel");
const cartModel = require("./cartModel");
const searchModel = require("../search/searchModel");
const shippingOptionsModel = require("../shippingOptions/shippingOptionsModel");
var router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  const user = await UserModel.findById(req?.userId);
  try {
    const cartDetails = await cartModel.findOne({ userId: req?.userId }).lean();
    return res.status(200).json({
      name: user?.username,
      entries: cartDetails?.entries || [],
      totalPrice: cartDetails?.totalPrice || {
        currency: "Rs",
        value: 0,
        formattedValue: "0Rs",
      },
      subTotalPrice: cartDetails?.subTotalPrice || {
        currency: "Rs",
        value: 0,
        formattedValue: "0Rs",
      },
      addresses: cartDetails?.address || {},
      primaryEmailAddress: cartDetails?.primaryEmailAddress || "",
      secondaryEmailAddress: cartDetails?.secondaryEmailAddress || [],
      offer: cartDetails?.offer || {},
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
    const { product, description, supplier, _id, price } = productData;
    const getCart = await cartModel.findOne({ userId: req?.userId });
    let result;
    if (getCart) {
      const {
        totalPrice: totalPriceToUpdate,
        subTotalPrice: subTotalPriceToUpdate,
      } = getCart;
      //Cart Already exists
      const getEntry = getCart?.entries?.find(
        (entry) => String(entry?.productId) === productId
      );
      if (getEntry) {
        //Entry exists updating quantity
        const { quantity: quantityToUpdate } = getEntry;
        result = await cartModel.updateOne(
          { _id: getCart?._id, "entries.productId": productId },
          {
            $set: {
              "entries.$.quantity": Number(quantity) + Number(quantityToUpdate),
              "entries.$.price": {
                currency: price?.currency,
                value:
                  price?.value * (Number(quantity) + Number(quantityToUpdate)),
                formattedValue: `${
                  price?.value * (Number(quantity) + Number(quantityToUpdate))
                }${price?.currency}`,
              },
              totalPrice: {
                currency: totalPriceToUpdate?.currency,
                value: totalPriceToUpdate?.value + price?.value * quantity,
                formattedValue: `${
                  totalPriceToUpdate?.value + price?.value * quantity
                }${totalPriceToUpdate?.currency}`,
              },
              subTotalPrice: {
                currency: subTotalPriceToUpdate?.currency,
                value: subTotalPriceToUpdate?.value + price?.value * quantity,
                formattedValue: `${
                  subTotalPriceToUpdate?.value + price?.value * quantity
                }${subTotalPriceToUpdate?.currency}`,
              },
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
                price: {
                  currency: price?.currency,
                  value: price?.value * quantity,
                  formattedValue: `${price?.value * quantity}${
                    price?.currency
                  }`,
                },
              },
            },
            $set: {
              totalPrice: {
                currency: totalPriceToUpdate?.currency,
                value: totalPriceToUpdate?.value + price?.value * quantity,
                formattedValue: `${
                  totalPriceToUpdate?.value + price?.value * quantity
                }${totalPriceToUpdate?.currency}`,
              },
              subTotalPrice: {
                currency: subTotalPriceToUpdate?.currency,
                value: subTotalPriceToUpdate?.value + price?.value * quantity,
                formattedValue: `${
                  subTotalPriceToUpdate?.value + price?.value * quantity
                }${subTotalPriceToUpdate?.currency}`,
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
      const { addresses } = await shippingOptionsModel?.findOne({
        userId: req?.userId,
      });
      const {
        cityProvince,
        country,
        isDefault,
        line1,
        line2,
        pinCode,
        state,
        _id: addressId,
      } = addresses?.find((address) => address?.isDefault);
      const cart = new cartModel({
        userId: user?._id,
        userName: user?.username,
        entries: [
          {
            product,
            description,
            supplier,
            productId: _id,
            quantity,
            price: {
              currency: price?.currency,
              value: price?.value * quantity,
              formattedValue: `${price?.value * quantity}${price?.currency}`,
            },
          },
        ],
        address: {
          cityProvince,
          country,
          isDefault,
          line1,
          line2,
          pinCode,
          state,
          _id: addressId,
        },
        totalPrice: {
          ...price,
          value: price?.value * quantity,
          formattedValue: `${price?.value * quantity}${price?.currency}`,
        },
        subTotalPrice: {
          ...price,
          value: price?.value * quantity,
          formattedValue: `${price?.value * quantity}${price?.currency}`,
        },
        primaryEmailAddress: user?.email,
        secondaryEmailAddress: [],
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
      const newEntries = cartDetails?.entries?.filter(
        (item) => String(item?.productId) !== productId
      );
      const isEntryAvailable = cartDetails?.entries?.find(
        (item) => String(item?.productId) === productId
      );
      if (newEntries?.length === 0) {
        const result = await cartModel.deleteOne({ _id: cartDetails?._id });
        return res.status(201).json({
          message: "Deleted Cart",
          type: "cartWSDTO",
        });
      } else {
        const result = await cartModel.updateOne(
          { _id: cartDetails?._id },
          {
            $set: {
              entries: [...newEntries],
              totalPrice: {
                ...cartDetails?.totalPrice,
                value: isEntryAvailable
                  ? cartDetails?.totalPrice?.value -
                    isEntryAvailable?.price?.value
                  : cartDetails?.totalPrice?.value,
                formattedValue: isEntryAvailable
                  ? `${
                      cartDetails?.totalPrice?.value -
                      isEntryAvailable?.price?.value
                    }${cartDetails?.totalPrice?.currency}`
                  : cartDetails?.totalPrice?.formattedValue,
              },
              subTotalPrice: {
                ...cartDetails?.subTotalPrice,
                value: isEntryAvailable
                  ? cartDetails?.subTotalPrice?.value -
                    isEntryAvailable?.price?.value
                  : cartDetails?.subTotalPrice?.value,
                formattedValue: isEntryAvailable
                  ? `${
                      cartDetails?.subTotalPrice?.value -
                      isEntryAvailable?.price?.value
                    }${cartDetails?.subTotalPrice?.currency}`
                  : cartDetails?.subTotalPrice?.formattedValue,
              },
            },
          }
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
