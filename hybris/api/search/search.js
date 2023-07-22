var express = require("express");
const searchModel = require("./searchModel");
const supplierModel = require("../supplier/supplierModel");
const { getFacets } = require("./getFacets");
var router = express.Router();

let currentData, totalData;

getMin = (a, b) => (a < b ? a : b);

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
  const currentPage = parseInt(req?.query?.currentPage) || 0;
  const currentQuery = parseInt(req?.query?.currentQuery) || "";
  const pageSize = parseInt(req?.query?.pageSize) || 10;
  const regex = new RegExp(searchTerm, "i");

  const totalResults = await searchModel.countDocuments({
    $or: [{ product: { $regex: regex } }, { description: { $regex: regex } }],
  });

  const totalPages = Math.ceil(totalResults / pageSize);

  const facets = await getFacets(searchTerm);

  if (searchTerm === "") res.status(200).json([]);
  else if (
    currentData?.searchTerm === searchTerm &&
    currentData?.pagination?.currentPage === currentPage &&
    currentData?.pagination?.pageSize === pageSize
  ) {
    res.json(currentData);
  } else if (
    currentData?.searchTerm === searchTerm &&
    currentData?.pagination?.currentPage !== currentPage &&
    currentData?.pagination?.pageSize === pageSize
  ) {
    const entriesToSend = totalData.slice(
      currentPage * pageSize,
      getMin((currentPage + 1) * 10, totalResults)
    );

    const dataToSend = {
      entries: [...entriesToSend],
      pagination: { currentPage, pageSize, totalPages, totalResults },
      searchTerm,
      currentQuery,
    };

    currentData = dataToSend;

    res.json(dataToSend);
  } else {
    try {
      totalData = await searchModel.find({
        $or: [
          { product: { $regex: regex } },
          { description: { $regex: regex } },
        ],
      });

      const entriesToSend = totalData.slice(
        currentPage * pageSize,
        getMin((currentPage + 1) * 10, totalResults)
      );

      const dataToSend = {
        entries: [...entriesToSend],
        pagination: { currentPage, pageSize, totalPages, totalResults },
        searchTerm,
        currentQuery,
      };

      currentData = dataToSend;

      res.json(dataToSend);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
});

module.exports = router;
