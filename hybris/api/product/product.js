var express = require("express");
const searchModel = require("../search/searchModel");
var router = express.Router();

router.get("/:productId", async (req, res) => {
  try {
    const product = await searchModel.findById(req?.params?.productId);
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/updatePrice", async (req, res) => {
  try {
    const { productId, currency, value } = req?.body;
    result = await searchModel.updateOne(
      { _id: productId },
      {
        $set: {
          "price.currency": currency,
          "price.value": value,
          "price.formattedValue": `${String(value)}${currency}`,
        },
      }
    );
    const product = await searchModel.findById(productId);
    return res.status(201).json({
      message: "Updated Price",
      result,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
});

module.exports = router;
