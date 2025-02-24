const express = require('express');
const connectDB = require('./config/db');
const dotenv = require("dotenv").config({ path: "./.env" });
const app = express()


//database connectivity
connectDB()

//public api listening for debugging
app.get("/", (req, res) => {
    res.json({
      message: "welcome to Global public API of Darshan25",
    });
  });



//listening server
PORT=process.env.PORT
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
  