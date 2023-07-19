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
  const currentPage = parseInt(req.query.currentPage) || 0;
  const pageSize = parseInt(req?.query?.pageSize) || 10;

  if (searchTerm === "") res.status(200).json([]);
  const regex = new RegExp(searchTerm, "i");
  try {
    const data = await searchModel
      .find({
        $or: [
          { product: { $regex: regex } },
          { description: { $regex: regex } },
        ],
      })
      .skip(currentPage * pageSize)
      .limit(pageSize);

    const totalResults = await searchModel.countDocuments({
      $or: [{ product: { $regex: regex } }, { description: { $regex: regex } }],
    });

    const totalPages = Math.ceil(totalResults / pageSize);

    res.json({
      entries: [...data],
      pagination: { currentPage, pageSize, totalPages, totalResults },
      searchTerm,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
