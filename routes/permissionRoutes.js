const express = require('express')
const { getAllPermissionsController } = require('../controllers/permissionController')

const router = express.Router()

//GET || All permissions

router.get("/get-permissions",getAllPermissionsController)

module.exports =router