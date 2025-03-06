const Role = require("../models/roleModal");
const Permission = require("../models/permissionModel");

// create role

exports.createRoleController = async (req, res) => {
    try {
        const { name, permissions } = req.body;

        if (!name || !permissions || !Array.isArray(permissions)) {
            return res.status(400).json({
                success: false,
                message: "Role name and permissions array are required",
            });
        }

        const existingRole = await Role.findOne({ name });
        if (existingRole) {
            return res.status(400).json({
                success: false,
                message: "Role name already exists",
            });
        }

        const validPermissions = await Permission.find({ _id: { $in: permissions } });

        if (validPermissions.length !== permissions.length) {
            return res.status(400).json({
                success: false,
                message: "One or more permissions are invalid",
            });
        }

        const newRole = await new Role({
            name,
            permissions: validPermissions.map((perm) => perm._id),
        }).save();

        res.status(201).json({
            success: true,
            message: "Role created successfully",
            role: newRole,
        });

    } catch (error) {
        console.error("Error creating role:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

//update role

exports.updateRoleController = async (req, res) => {
    try {
        const { name, permissions } = req.body;
        const roleId = req.params.id;

        const role = await Role.findById(roleId);
        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found",
            });
        }

        const validPermissions = await Permission.find({ _id: { $in: permissions } });

        if (validPermissions.length !== permissions.length) {
            return res.status(400).json({
                success: false,
                message: "One or more permissions are invalid",
            });
        }

        const updatedRole = await Role.findByIdAndUpdate(
            roleId,
            {
                name: name || role.name,
                permissions: validPermissions.map((perm) => perm._id),
            },
            { new: true }
        ).populate("permissions");

        res.status(200).json({
            success: true,
            message: "Role updated successfully",
            role: updatedRole,
        });

    } catch (error) {
        console.error("Error updating role:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

//delete role

exports.deleteRoleController = async (req, res) => {
    try {
        const roleId = req.params.id;

        const role = await Role.findByIdAndDelete(roleId);

        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Role deleted successfully",
        });

    } catch (error) {
        console.error("Error deleting role:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

//get all roles

exports.getAllRolesController = async (req, res) => {
    try {
        const roles = await Role.find().populate({
            path: "permissions",
            model: "Permission",
        });

        res.status(200).json({
            success: true,
            message: "Roles fetched successfully",
            roles,
        });

    } catch (error) {
        console.error("Error fetching roles:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};


