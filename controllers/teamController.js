const Team = require('../models/teamModel');
const Permission = require('../models/permissionModel')

exports.createTeamController = async (req, res) => {
    try {
        const { name, permissions } = req.body;

        // Validate request body
        if (!name || !permissions || !Array.isArray(permissions)) {
            return res.status(400).json({
                success: false,
                message: 'Team name and permissions array are required',
            });
        }

        // Check if team name already exists
        const existingTeam = await Team.findOne({ name });
        if (existingTeam) {
            return res.status(400).json({
                success: false,
                message: 'Team name already exists',
            });
        }

        console.log("Requested Permissions:", permissions);

        const validPermissions = await Permission.find({ name: { $in: permissions } });
        
        console.log("Found Permissions in DB:", validPermissions);
        console.log("Valid Permission Names:", validPermissions.map(p => p.name));

        if (validPermissions.length !== permissions.length) {
            return res.status(400).json({
                success: false,
                message: 'One or more permissions are invalid',
            });
        }

        // Create new team
        const newTeam = new Team({
            name,
            permissions: validPermissions.map((perm) => perm._id),
        });

        await newTeam.save();

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
