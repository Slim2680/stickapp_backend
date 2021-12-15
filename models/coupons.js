const mongoose = require("mongoose");

const couponsSchema = mongoose.Schema({
  Code: String,
  Value: Number,
  Reward: String,
  Image: String,
  Brand: String,
});

const couponsModel = mongoose.model("coupons", couponsSchema);

module.exports = couponsModel;
