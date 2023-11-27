const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  userId: {
    required: false,
    type: mongoose.Schema.Types.ObjectId,
  },
  addresses: [
    {
      line1: {
        type: String,
        required: true,
      },
      line2: {
        type: String,
        required: true,
      },
      cityProvince: {
        type: String,
        required: true,
      },
      pinCode: {
        type: Number,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      isDefault: {
        type: Boolean,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("shippingOptions", dataSchema);
