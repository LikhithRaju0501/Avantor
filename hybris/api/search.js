var express = require("express");
const searchModel = require("./searchModel");
var router = express.Router();

router.post("/", async (req, res) => {
  console.log(req?.body);
  const data = new searchModel({
    product: req.body.product,
    description: req.body.description,
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
  try {
    const data = await searchModel.find();
    res.json({ ...data, searchTerm });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
