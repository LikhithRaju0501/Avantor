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
  offers: [
    {
      name: {
        type: String,
        required: true,
      },
      type: {
        type: Number,
        required: true,
      },
      costReduction: {
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
      minimumCost: {
        type: {
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
        default: {
          currency: "Rs",
          value: 0,
          formattedValue: "200 Rs",
        },
      },
      discountDisplay: {
        type: String,
        required: true,
      },
      discountTAndC: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("offers", dataSchema);
