const foodModel = require("../models/foodModel");
const fs = require("fs");

//Add food
const addFood = async (req, res) => {
  try {
    console.log(req.file); // Log req.file to debug

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "File is missing" });
    }

    let image_filename = req.file.filename;

    const { foodName, description, price, category } = req.body;

    if (!foodName || !description || !price || !category) {
      res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    const food = new foodModel({
      foodName: foodName,
      description: description,
      price: price,
      image: image_filename,
      category: category,
    });

    const newfood = await food.save();
    res.status(201).json({
      sucess: true,
      message: "Food added successfully",
      food: newfood,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ sucess: false, message: "Internal Server Error" });
  }
};

const getFood = async (req, res) => {
  try {
    const food = await foodModel.find({});
    res.status(200).json({ success: true, food: food });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.id);
    if (!food) {
      return res
        .status(404)
        .json({ success: false, message: "Food not found" });
    }

    const image = food.image;
    // fs.unlinkSync(`./uploads/${image}`);

    await foodModel.findByIdAndDelete(food.id);
    res.status(200).json({ success: true, message: "Food removed" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  addFood,
  getFood,
  removeFood,
};
