
const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  foodName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

const Foodmodel = mongoose.models.food || mongoose.model("food", foodSchema);

module.exports = Foodmodel;
