const express = require("express");
const { registerUserController, loginUserController, testController, userController } = require("../controllers/userController");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router()

//POST || Register User
router.post("/register", registerUserController);

//POST || Login User
router.post("/login",loginUserController)

//admin test

router.get("/admin-test", requireSignIn, isAdmin, testController);

//SIGNIN test

router.get("/user-test", requireSignIn, userController);


module.exports = router