const express = require("express");
const { registerUserController, loginUserController, testController, userController, updateUserController, deleteUserController, assignTeamToUserController, getAllUsersController } = require("../controllers/userController");
const { requireSignIn, isAdmin, checkPermission } = require("../middlewares/authMiddleware");

const router = express.Router()

//POST || Register User
router.post("/register",registerUserController);

//POST || Create user
router.post("/create",checkPermission("create_user"),registerUserController)

//POST || Login User
router.post("/login",loginUserController)

//GET || admin test

router.get("/admin-test", requireSignIn, isAdmin, testController);

//GET || SIGNIN test

router.get("/user-test", requireSignIn, userController);

//PUT || update user

router.put("/update-user/:id",checkPermission("update_user"),updateUserController)

//DELETE || Delete User

router.delete("/delete-user/:id",checkPermission("delete_user"),deleteUserController)

// POST || Assign team to user

router.post("/assign-team",assignTeamToUserController)

//GET || Get All Users

router.get("/getusers",checkPermission("read_user"),getAllUsersController)


module.exports = router