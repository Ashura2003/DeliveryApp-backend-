// Importing express package
const express = require("express");

// Importing cors package
const cors = require("cors");

// Importing body-parser package
const bodyParser = require("body-parser");

// Importing express-fileupload package
const acceptFormData = require("express-fileupload");

// Importing dotenv package
const dotenv = require("dotenv");

// Configuring dotenv
dotenv.config();

// Importing connectDatabase function from database.js
const connectDatabase = require("./database/database");

// Connecting to database
connectDatabase();

const PORT = process.env.PORT;

// Creating express app
const app = express();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
