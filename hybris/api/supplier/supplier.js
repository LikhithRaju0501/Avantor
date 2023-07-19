var express = require("express");
const supplierModel = require("./supplierModel");
var router = express.Router();

router.post("/", async (req, res) => {
  const data = new supplierModel({
    supplierName: req.body.supplierName,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// router.get("/:searchTerm", async (req, res) => {
//   const searchTerm = req?.params?.searchTerm;

//   if (searchTerm === "") res.status(200).json([]);
//   const regex = new RegExp(searchTerm, "i");
//   try {
//     const data = await searchModel.find({
//       $or: [{ product: { $regex: regex } }, { description: { $regex: regex } }],
//     });
//     res.json({ entries: [...data], searchTerm });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

module.exports = router;
