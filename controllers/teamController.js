const Team = require('../models/teamModel');
const Permission = require('../models/permissionModel');
const teamModel = require('../models/teamModel');

exports.createTeamController = async (req, res) => {
    try {
        const { name, permissions } = req.body;

        
        if (!name || !permissions || !Array.isArray(permissions)) {
            return res.status(400).json({
                success: false,
                message: 'Team name and permissions array are required',
            });
        }

        
        const existingTeam = await Team.findOne({ name });
        if (existingTeam) {
            return res.status(200).json({
                success: false,
                message: 'Team name already exists',
            });
        }

        console.log("Requested Permissions:", permissions);

        const validPermissions = await Permission.find({ _id: { $in: permissions } });
        
        console.log("Found Permissions in DB:", validPermissions);
        console.log("Valid Permission Names:", validPermissions.map(p => p.name));

        if (validPermissions.length !== permissions.length) {
            return res.status(400).json({
                success: false,
                message: 'One or more permissions are invalid',
            });
        }

        
        const newTeam =await new Team({
            name,
            permissions: validPermissions.map((perm) => perm._id),
        }).save();

        

        res.status(201).json({
            success: true,
            message: 'Team created successfully',
            team: newTeam,
        });

    } catch (error) {
        console.error('Error creating team:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

//update team controller

exports.updateTeamController = async (req, res) => {
    try {
        const { name, permissions } = req.body;
        const teamId  = req.params.id;

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found"
            });
        }

        
        const updatedTeam = await Team.findByIdAndUpdate(
            teamId,
            {
                name: name || team.name,
                permissions: permissions || team.permissions
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Team Updated Successfully",
            updatedTeam
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

//delete team controller 

exports.deleteTeamController=async(req,res)=>{
    try {
        const teamId = req.params.id
        const team =await teamModel.findByIdAndDelete(teamId)

        if(!team){
            return res.status(404).json({
                success:false,
                message:"Team Not Found"
            })
        }
        res.status(200).json({
            success:true,
            message:"Team Deleted Successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

//get all teams

exports.getAllTeamsController = async(req,res)=>{
    try {
        const teams = await teamModel.find().populate({
            path:"permissions",
            model:"Permission"
        })
        
        res.status(200).json({
            success:true,
            message:"Teams Fetched Successfully",
            teams
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}
