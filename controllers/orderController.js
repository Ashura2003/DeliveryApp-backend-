const orderModel = require("../models/orderModel");

const userModel = require("../models/userModel");

const Stripe = require("stripe");

const dotenv = require("dotenv");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing user order for frontend
const placeOrder = async (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL;
  const nprToUsdRate = 0.0075; // Example conversion rate (1 NPR = 0.0075 USD)

  try {
    const newOrder = new orderModel({
      userId: req.user.id,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    await newOrder.save();

    // Empty the cart
    await userModel.findByIdAndUpdate(req.user.id, { cartData: {} });

    // Payment
    const line_items = req.body.items.map((item) => {
      if (!item.name || !item.price || !item.quantity) {
        throw new Error("Invalid item data"); // Catch any invalid items
      }
      const priceInUsd = item.price * nprToUsdRate; // Convert price to USD
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(priceInUsd * 100), // Convert to cents
        },
        quantity: item.quantity,
      };
    });

    // Add delivery charge as a separate item
    const deliveryChargeInUsd = 10 * nprToUsdRate; // Convert delivery charge to USD
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Charge",
        },
        unit_amount: Math.round(deliveryChargeInUsd * 100), // Convert to cents
      },
      quantity: 1,
    });

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontendUrl}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontendUrl}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.status(200).json({
      success: true,
      message: "Order placed successfully",
      session_url: session.url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;

  console.log(orderId);
  console.log(success);

  console.log(req.body);

  try {
    if (success) {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.status(200).json({
        success: true,
        message: "Order placed successfully",
      });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.status(400).json({
        success: false,
        message: "Order failed",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// User orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.user.id });
    res.status(200).json({
      success: true,
      orders: orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = { placeOrder, verifyOrder, userOrders };
