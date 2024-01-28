var express = require("express");
const authenticateToken = require("../middleware/middleware");
const UserModel = require("../user/UserModel");
const cartModel = require("../cart/cartModel");
const orderModel = require("../order/orderModel");
const offerModel = require("./offerModel");
var router = express.Router();

const newUserOffer = {
  name: "Welcome to Ammijan",
  costReduction: {
    currency: "Rs",
    value: 100,
    formattedValue: "200 Rs",
  },
  discountDisplay: "flat 200 off",
  discountTAndC: "on Purchase of items over 500",
  minimumCost: {
    currency: "Rs",
    value: 500,
    formattedValue: "500 Rs",
  },
};

const thankYouOffer = {
  name: "Thank You Offer",
  costReduction: {
    currency: "Rs",
    value: 200,
    formattedValue: "200 Rs",
  },
  discountDisplay: "flat 200 off",
  discountTAndC: "on Purchase of items over 1000",
  minimumCost: {
    currency: "Rs",
    value: 1000,
    formattedValue: "200 Rs",
  },
};

router.get("/", authenticateToken, async (req, res) => {
  try {
    const { offers } = await offerModel
      .findOne({ userId: req?.userId })
      .select("offers")
      .lean();

    const { totalPrice: cartTotal } =
      (await cartModel
        .findOne({
          userId: req?.userId,
        })
        .lean()) || {};

    if (!cartTotal) {
      return res.status(500).json({
        message: "Empty Cart",
      });
    }

    return res.status(200).json([...normalizedOffers(offers, cartTotal)]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
});

const normalizedOffers = (offers, totalPrice) => {
  let normalizedOffers = [];
  for (const offer of offers) {
    normalizedOffers = [
      ...normalizedOffers,
      {
        ...offer,
        isDisabled: offer?.minimumCost?.value > totalPrice?.value,
        savings: {
          currency: offer?.costReduction?.currency,
          value: totalPrice?.value - offer?.costReduction?.value,
          formattedValue: `${totalPrice?.value - offer?.costReduction?.value}${
            offer?.costReduction?.currency
          }`,
        },
      },
    ];
  }
  return normalizedOffers;
};

const offersHandler = async (req, res, shouldShowStatus = true) => {
  try {
    const user = await UserModel.findById(req?.userId).lean();
    const userOrders = await orderModel
      .findOne({ userId: req?.userId })
      .select("orders");
    if (!userOrders) {
      const offer = { ...newUserOffer };
      await createNewOfferHandler(user, offer);
      return (
        shouldShowStatus &&
        res.status(201).json({
          message: "Coupon created",
        })
      );
    }
    if (userOrders?.orders?.length === 1) {
      const offer = { ...thankYouOffer };
      await createNewOfferHandler(user, offer);
      return (
        shouldShowStatus &&
        res.status(201).json({
          message: "Coupon created",
        })
      );
    }

    const { totalPrice: cartTotal } = await cartModel
      .findOne({
        userId: req?.userId,
      })
      .lean();
    return res.status(201).json({
      message: "Something went wrong",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
};

const createNewOfferHandler = async (user, offer) => {
  const userOffers = await offerModel.findOne({
    userId: user?._id,
  });
  if (userOffers && userOffers?.offers?.length) {
    const result = await offerModel.findOneAndUpdate(
      { _id: userOffers?._id },
      {
        $push: {
          offers: { ...offer },
        },
      },
      { new: true }
    );
    return;
  } else {
    const currentOffer = new offerModel({
      userId: user?._id,
      userName: user?.username,
      offers: [{ ...offer }],
    });

    const result = await currentOffer.save();
    return;
  }
};

router.post("/", authenticateToken, offersHandler);

module.exports = { router, offersHandler };
