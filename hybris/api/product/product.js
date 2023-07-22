var express = require("express");
const searchModel = require("../search/searchModel");
const supplierModel = require("../supplier/supplierModel");
const mongodb = require("mongodb");
const ObjectId = mongodb.ObjectId;
const mongoose = require("mongoose");
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
