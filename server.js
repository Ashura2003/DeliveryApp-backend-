const express = require("express");

const cors = require("cors");

const dotenv = require("dotenv");

// const acceptFormData = require("express-fileupload");

// Database configuration
const connectDB = require("./config/db");

// Dotenv configuration
dotenv.config();

// Application configuration
const app = express();
const PORT = process.env.PORT;

//Static Files
app.use(express.static("./public"));

// Middleware
app.use(express.json());
app.use(cors());
// app.use(acceptFormData());

// Database connection
connectDB();

// Api Routes
app.use("/api/food", require("./routes/foodRoute"));
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/cart", require("./routes/cartRoute"));
app.use("/api/order", require("./routes/orderRoute"));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
