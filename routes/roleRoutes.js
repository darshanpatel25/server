const express = require("express")
const { checkPermission } = require("../middlewares/authMiddleware")
const { createRoleController, updateRoleController, deleteRoleController, getAllRolesController } = require("../controllers/roleController")

const router = express.Router()

//POST || Create Role

router.post("/create",checkPermission("create_role"),createRoleController)

// PUT || Update Role

router.put("/update/:id",checkPermission("update_role"),updateRoleController)

//DELETE || Delete Role

router.delete("/delete/:id",checkPermission("delete_role"),deleteRoleController)

//GET || Get All Roles

router.get("/get",checkPermission("read_role"),getAllRolesController)

module.exports = router