var express = require("express");
const searchModel = require("./searchModel");
const supplierModel = require("../supplier/supplierModel");
var router = express.Router();

router.get("/", async (req, res) => res.status(200).json([]));

router.post("/", async (req, res) => {
  const supplier = await supplierModel.findById(req?.body?.supplierId);
  const data = new searchModel({
    product: req?.body?.product,
    description: req?.body?.description,
    supplier: supplier,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/:searchTerm", async (req, res) => {
  const searchTerm = req?.params?.searchTerm;

  if (searchTerm === "") res.status(200).json([]);
  const regex = new RegExp(searchTerm, "i");
  try {
    const data = await searchModel.find({
      $or: [{ product: { $regex: regex } }, { description: { $regex: regex } }],
    });
    res.json({ entries: [...data], searchTerm });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
