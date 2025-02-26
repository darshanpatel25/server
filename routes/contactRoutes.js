const express = require('express')
const { requireSignIn } = require('../middlewares/authMiddleware')
const { createContactController } = require('../controllers/contactController')

const router = express.Router()

//POST || Create contact

router.post("/create",requireSignIn,createContactController)

module.exports = router