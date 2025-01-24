const foodModel = require("../models/foodModel");
const fs = require("fs");
const path = require("path");

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
    fs.unlinkSync(`./uploads/${image}`);

    await foodModel.findByIdAndDelete(food.id);
    res.status(200).json({ success: true, message: "Food removed" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const editFood = async (req, res) => {
  try {
    console.log(req.file); // Log to confirm multer processed the file

    const { foodName, description, price, category } = req.body;

    // Find the existing food item
    const existingFood = await foodModel.findById(req.params.id);
    if (!existingFood) {
      return res
        .status(404)
        .json({ success: false, message: "Food not found" });
    }

    let updatedFields = {
      foodName: foodName || existingFood.foodName,
      description: description || existingFood.description,
      price: price || existingFood.price,
      category: category || existingFood.category,
      image: existingFood.image,
    };

    // Handle file upload
    if (req.file) {
      const newImage = req.file.filename;

      // Delete old image if it exists
      if (existingFood.image) {
        const oldImagePath = path.join(
          __dirname,
          `../uploads/${existingFood.image}`
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Add new image to the updated fields
      updatedFields.image = newImage;
    }

    // Update the food item
    const updatedFood = await foodModel.findByIdAndUpdate(
      req.params.id,
      updatedFields,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Food updated successfully!",
      food: updatedFood,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getSingleFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.id);
    if (!food) {
      return res
        .status(404)
        .json({ success: false, message: "Food not found" });
    }
    res.status(200).json({ success: true, food: food });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  addFood,
  getFood,
  removeFood,
  editFood,
  getSingleFood,
};