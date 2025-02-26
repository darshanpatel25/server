const express = require('express')
const { createTeamController, updateTeamController, deleteTeamController, getAllTeamsController } = require('../controllers/teamController')
const { checkPermission } = require('../middlewares/authMiddleware')

const router = express.Router()

//POST || team Creation 

router.post("/create",checkPermission("create_team"),createTeamController)

//PUT || Team Update

router.put('/update/:id',updateTeamController)

//DELETE || Delete Team

router.delete('/delete/:id',deleteTeamController)

//GET || get all teams

router.get('/getteams',getAllTeamsController)



module.exports = router