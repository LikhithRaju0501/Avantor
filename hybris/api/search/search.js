var express = require("express");
const searchModel = require("./searchModel");
const supplierModel = require("../supplier/supplierModel");
const { getFacets, getPaginatedData } = require("./resuableMethods");
const { escapeRegExp } = require("lodash");
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
  const escapedUserInput = escapeRegExp(searchTerm);
  const regex = new RegExp(escapedUserInput, "i");

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
    return res.status(200).json(currentData);
  } else if (
    currentData?.searchTerm === searchTerm &&
    currentData?.pagination?.currentPage !== currentPage &&
    currentData?.pagination?.pageSize === pageSize
  ) {
    currentData = getPaginatedData(
      totalData,
      currentPage,
      pageSize,
      totalPages,
      totalResults,
      searchTerm,
      currentQuery
    );

    return res
      .status(200)
      .json(
        getPaginatedData(
          totalData,
          currentPage,
          pageSize,
          totalPages,
          totalResults,
          searchTerm,
          currentQuery
        )
      );
  } else {
    try {
      totalData = await searchModel.find({
        $or: [
          { product: { $regex: regex } },
          { description: { $regex: regex } },
        ],
      });

      currentData = getPaginatedData(
        totalData,
        currentPage,
        pageSize,
        totalPages,
        totalResults,
        searchTerm,
        currentQuery
      );

      return res
        .status(200)
        .json(
          getPaginatedData(
            totalData,
            currentPage,
            pageSize,
            totalPages,
            totalResults,
            searchTerm,
            currentQuery
          )
        );
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
});

module.exports = router;
