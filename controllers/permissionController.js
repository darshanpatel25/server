const permissionModel = require("../models/permissionModel")

exports.getAllPermissionsController = async(req,res)=>{
    try {
        const permissions =await permissionModel.find()
        res.status(200).json({
            success:true,
            message:"Permission Fetched Successfuully",
            permissions
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}