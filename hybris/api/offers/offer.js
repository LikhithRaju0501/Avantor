var express = require("express");
const authenticateToken = require("../middleware/middleware");
const UserModel = require("../user/UserModel");
const cartModel = require("../cart/cartModel");
const orderModel = require("../order/orderModel");
const offerModel = require("./offerModel");
var router = express.Router();
const { ObjectId } = require("mongodb");

const newUserOffer = {
  name: "Welcome to Ammijan",
  type: 1,
  costReduction: {
    currency: "Rs",
    value: 100,
    formattedValue: "100 Rs",
  },
  discountDisplay: "flat 100 off",
  discountTAndC: "on Purchase of items over 500",
  minimumCost: {
    currency: "Rs",
    value: 500,
    formattedValue: "500 Rs",
  },
};

const thankYouOffer = {
  name: "Thank You Offer",
  type: 1,
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
    const userOffers = await offerModel
      .findOne({ userId: req?.userId })
      .select("offers")
      .lean();

    if (userOffers?.offers) {
      const { offers } = userOffers;
      const { totalPrice: cartTotal, offer: currentOffer } =
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

      return res
        .status(200)
        .json([...normalizedOffers(offers, cartTotal, currentOffer)]);
    } else {
      return res.status(200).json([]);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
});

const normalizedOffers = (offers, totalPrice, currentOffer) => {
  let normalizedOffers = [];
  for (const offer of offers) {
    normalizedOffers = [
      ...normalizedOffers,
      {
        ...offer,
        isDisabled:
          offer?.minimumCost?.value > totalPrice?.value ||
          String(offer?._id) === String(currentOffer?._id),
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
router.post("/apply-code", authenticateToken, async (req, res) => {
  try {
    const { offerId } = req?.body;
    if (!offerId) {
      return res.status(404).json({
        message: "Please select an offer",
      });
    }
    const { offers } =
      (await offerModel.findOne({ userId: req?.userId }).lean()) || [];

    const offer = offers?.find((offer) => String(offer?._id) === offerId);

    if (!offer) {
      return res.status(404).json({
        message: "Invalid offer",
      });
    }

    const getCart = await cartModel.findOne({ userId: req?.userId }).lean();
    await cartModel.findOneAndUpdate(
      { _id: getCart?._id },
      {
        offer: {
          ...offer,
        },
        subTotalPrice: {
          currency: offer?.costReduction?.currency,
          value: getCart?.totalPrice?.value - offer?.costReduction?.value,
          formattedValue: `${
            getCart?.totalPrice?.value - offer?.costReduction?.value
          }${offer?.costReduction?.currency}`,
        },
      },
      { new: true }
    );

    return res.status(201).json({
      message: "Promo Code Applied.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Something went wrong",
      error,
    });
  }
});

module.exports = { router, offersHandler };
