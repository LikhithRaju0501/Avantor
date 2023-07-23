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

module.exports = router;
