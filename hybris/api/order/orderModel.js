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
  orders: [
    {
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
        },
      ],
      totalPrice: {
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
      subTotalPrice: {
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
      address: {
        _id: {
          required: false,
          type: mongoose.Schema.Types.ObjectId,
        },
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
      emailAddresses: {
        required: true,
        type: [String],
      },
      numberOfItems: {
        required: true,
        type: Number,
      },
      orderStatus: {
        required: true,
        type: String,
      },
      createdAt: {
        type: Date,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("order", dataSchema);
