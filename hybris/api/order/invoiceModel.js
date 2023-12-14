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
  invoices: [
    {
      name: {
        type: String,
        required: true,
      },
      invoicePDF: {
        type: String,
        required: true,
      },
      paymentDate: {
        type: Date,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("invoice", dataSchema);
