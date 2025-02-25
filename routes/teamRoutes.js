const express = require('express')
const { createTeamController } = require('../controllers/teamController')

const router = express.Router()

//team Creation || POST

router.post("/create",createTeamController)



module.exports = router