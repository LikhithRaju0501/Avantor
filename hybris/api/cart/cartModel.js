const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  userId: {
    required: false,
    type: mongoose.Schema.Types.ObjectId,
  },
  userName: {
    required: false,
    type: String,
  },
  entries: [
    {
      productId: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
      },
      product: {
        required: true,
        type: String,
      },
      description: {
        required: true,
        type: String,
      },
      quantity: { required: true, type: Number },
      supplier: {
        _id: mongoose.Schema.Types.ObjectId,
        supplierName: String,
      },
    },
  ],
});

module.exports = mongoose.model("cart", dataSchema);
