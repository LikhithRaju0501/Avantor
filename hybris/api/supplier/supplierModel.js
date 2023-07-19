const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  supplierName: {
    required: true,
    type: String,
  },
});

module.exports = mongoose.model("supplier", dataSchema);
