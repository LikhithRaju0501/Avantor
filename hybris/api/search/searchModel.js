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
  price: {
    currency: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    formattedValue: {
      type: String,
      required: true,
    },
  },
});

module.exports = mongoose.model("products", dataSchema);
