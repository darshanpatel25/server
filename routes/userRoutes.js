const express = require("express");
const { registerUserController, loginUserController, testController, userController, updateUserController } = require("../controllers/userController");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");

const router = express.Router()

//POST || Register User
router.post("/register", registerUserController);

//POST || Login User
router.post("/login",loginUserController)

//GET || admin test

router.get("/admin-test", requireSignIn, isAdmin, testController);

//GET || SIGNIN test

router.get("/user-test", requireSignIn, userController);

//POST || update user

router.put("/update-user/:id",requireSignIn,updateUserController)


module.exports = router