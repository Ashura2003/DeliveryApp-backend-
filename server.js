const express = require('express');

const cors = require('cors');

const dotenv = require('dotenv');

// Database configuration
const connectDB = require('./config/db')

// Dotenv configuration
dotenv.config();

// Application configuration
const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
connectDB();

// Api Routes
app.use("/api/food",require('./routes/foodRoute'));
app.use('/image',express.static('uploads'));
app.use('/api/user', require('./routes/userRoute'));

app.get("/",(req,res)=>{
    res.send("Hello World");
})

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});