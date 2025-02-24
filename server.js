const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require("./routes/userRoutes")
const dotenv = require("dotenv").config({ path: "./.env" });
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');


app.use(bodyParser.json());

app.use(cors()); 

//database connectivity
connectDB()

//public api listening for debugging
app.get("/", (req, res) => {
    res.json({
      message: "welcome to Global public API of Darshan25",
    });
  });


//user route
app.use("/api/v1/user", userRoutes);


//listening server
PORT=process.env.PORT
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
  