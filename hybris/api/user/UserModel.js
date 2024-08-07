const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  email: {
    required: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  username: {
    required: true,
    type: String,
  },
  profilePic: {
    isProfilePic: {
      required: true,
      type: Boolean,
    },
    userProfilePic: {
      required: true,
      type: String,
    },
  },
});

module.exports = mongoose.model("user", dataSchema);
