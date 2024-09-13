// Importing mongoose
const mongoose = require('mongoose');

// Importing dotenv
const dotenv = require('dotenv');

// Configuring dotenv
dotenv.config();

// Database connection
const connectDatabase = () => {
    mongoose.connect(process.env.DB_CONNECTION).then(() => {
        console.log('Database connection successful');
    })
};

module.exports = connectDatabase;

