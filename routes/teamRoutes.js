const express = require('express')
const { createTeamController, updateTeamController } = require('../controllers/teamController')

const router = express.Router()

//POST || team Creation 

router.post("/create",createTeamController)

//PUT || Team Update

router.put('/update/:id',updateTeamController)

//DELETE || Delete Team

router.delete('/delete/:id')



module.exports = router