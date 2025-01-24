const mongoose = require('mongoose');

const dotenv = require('dotenv');

const connectDB = async () => {
    mongoose.connect(process.env.MONGODB_URL).then(() => {
        console.log("Database connected");
    });
};

module.exports = connectDB;