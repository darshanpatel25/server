const express = require("express");
const { registerUserController, loginUserController } = require("../controllers/userController");

const router = express.Router()

//POST || Register User
router.post("/register", registerUserController);

//POST || Login User
router.post("/login",loginUserController)

module.exports = router