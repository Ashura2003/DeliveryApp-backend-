
const userModel = require("../models/userModel");

// Add items to user cart
const addToCart = async (req, res) => {
  try {
    // Fetch user data from the database
    let userData = await userModel.findOne({ _id: req.user.id });

    // Check if the user exists
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Initialize cartData if it doesn't exist
    let cartData = userData.cartData || {};

    // Update cartData with the item
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1; // Add item with quantity 1
    } else {
      cartData[req.body.itemId] += 1; // Increment item quantity
    }

    // Save updated cartData back to the database
    await userModel.findByIdAndUpdate(req.user.id, { cartData: cartData });

    // Respond with success
    res.status(200).json({ success: true, message: "Item added to cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Remove items from user cart
const removeFromCart = async (req, res) => {
  try {
    let userData = await userModel.findOne({ _id: req.user.id });
    let cartData = await userData.cartData;

    // Check if the item exists in the cart
    if (!cartData[req.body.itemId]) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart" });
    }

    // Decrement the item quantity
    cartData[req.body.itemId] -= 1;

    // Remove item if quantity is 0
    if (cartData[req.body.itemId] === 0) {
      delete cartData[req.body.itemId];
    }

    // Save updated cartData back to the database
    await userModel.findByIdAndUpdate(req.user.id, { cartData: cartData });

    // Respond with success
    res.status(200).json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Fetch User Cart Data
const getCart = async (req, res) => {
  try {
    let userData = await userModel.findOne({ _id: req.user.id });
    let cartData = await userData.cartData;

    res.status(200).json({ success: true, cartData: cartData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  getCart,
};
