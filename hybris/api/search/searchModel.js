const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  product: {
    required: true,
    type: String,
  },
  description: {
    required: true,
    type: String,
  },
  supplier: {
    _id: mongoose.Schema.Types.ObjectId,
    supplierName: String,
  },
});

module.exports = mongoose.model("products", dataSchema);
