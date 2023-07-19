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
    id: mongoose.Schema.Types.ObjectId,
    name: String,
  },
});

module.exports = mongoose.model("products", dataSchema);
