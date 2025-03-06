const express = require('express')
const userModel = require('../models/userModel')
const sendOTPEmail = require('../utils/otpMail')
const { hashPassword, comparePassword } = require('../helpers/authHelper')
const JWT = require('jsonwebtoken')
const Team = require("../models/teamModel");
const roleModal = require('../models/roleModal')

// register

exports.registerUserController = async (req, res) => {
    try {
      
        const { name, password, email } = req.body

        

        if(!name || !email || !password || name=="" || password=="" || email==""){
          return res.status(200).json({
            success:false,
            message:"All Fields are required"
          })
        }

        let emailFormat = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(email==='' || !email.match(emailFormat)){
          return res.status(200).json({
            success:false,
            message:"Enter Valid Email"
          })
        }
        if(password.length<8){
          return res.status(200).json({
            success:false,
            message:"Password should be greater than 8 characters"
          })
        }


        //findind duplicacy

        const exUser = await userModel.findOne({ email: email.toLowerCase() })
        const HasedPassword = await hashPassword(password)
        if (exUser) {

            return res.status(200).json({
                success: false,
                message: "User Already Exists"
            })


        }
        else {
            const user = await new userModel({
                name,
                password: HasedPassword,
                email,
            }).save()
            return res.status(201).json({
                success: true,
                message: "User Created Succesfully",
                user
            })
        }



    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Interal Server Error"
        })
    }
}

//login

exports.loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await userModel.findOne({ email });

    if (!existingUser) {
      return res.status(200).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const match = await comparePassword(password, existingUser.password);
    if (!match) {
      return res.status(200).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // JWT generation
    const token = await JWT.sign(
      { _id: existingUser._id, access: existingUser.access }, 
      process.env.JWT_SECRET,
      {
        expiresIn: "20d",
      }
    );

    res.status(200).json({
      success: true,
      message: "User Login Successful",
      user:existingUser, 
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


//admin check

exports.testController = (req, res) => {
  res.status(200).json({ success: true });
};

//signin check

exports.userController = (req, res) => {
  res.status(200).json({ success: true });
};

//update user

exports.updateUserController = async(req,res)=>{
  try {

    const { name, password, } = req.body;
    const user =await userModel.findById(req.params.id);

    if(name.trim()==""){
      return res.status(200).json({
        success:false,
        message:"Name Can't Be Empty"
      })
    }
    if(password.length<8){
      return res.status(200).json({
        success:false,
        message:"Password must be greater than 8 characters"
      })
    }
    

    const hashedPassword = password ? await hashPassword(password) : undefined;

    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "User Updated Successfully",
      updatedUser,
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({
      success:false,
      message:"Internal Server Error"
    })
  }
}

//delete user controller

exports.deleteUserController = async(req,res)=>{
  try {

    const userId = req.params.id

    const user =await userModel.findByIdAndDelete(userId)

    res.status(200).json({
      success:true,
      message:"User Deleted Successfully"

    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      success:false,
      message:"Internal Server Error"
    })
  }
}

//assigning team to user




exports.assignTeamToUserController = async (req, res) => {
  try {
    const { userId, teamId } = req.body;

    // Validate user and team existence
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }

    // Check if user is already assigned to the team
    if (user.teams.includes(teamId)) {
      return res.status(400).json({
        success: false,
        message: "User is already assigned to this team",
      });
    }

    // Assign team to user
    user.teams.push(teamId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Team assigned to user successfully",
      user,
    });
  } catch (error) {
    console.error("Error assigning team to user:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//get all users

exports.getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find()
      .populate({
        path: "teams",
        populate: { path: "permissions", model: "Permission" },
      })
      .populate({
        path: "roles",
        populate: { path: "permissions", model: "Permission" },
      })
      .select("name email teams roles");

    const formattedUsers = users.map(user => {
    
      const userPermissions = new Set();

      user.teams.forEach((team) => {
        team.permissions.forEach((permission) => {
          userPermissions.add(permission.name);
        });
      });

      user.roles.forEach((role) => {
        role.permissions.forEach((permission) => {
          userPermissions.add(permission.name);
        });
      });

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        teams: user.teams.map((team) => team.name),
        roles: user.roles.map((role) => role.name),
        permissions: Array.from(userPermissions),
      };
    });

    res.status(200).json({
      success: true,
      users: formattedUsers,
    });

  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// get user details


exports.getUserDetailsController = async (req, res) => {
  try {
    const user = await userModel.findById(req.headers.id)
      .populate({
        path: "teams",
        populate: { path: "permissions", model: "Permission" },
      })
      .populate({
        path: "roles",
        populate: { path: "permissions", model: "Permission" },
      })
      .select("name email teams roles");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    
    const userPermissions = new Set();

    user.teams.forEach((team) => {
      team.permissions.forEach((permission) => {
        userPermissions.add(permission.name);
      });
    });

    user.roles.forEach((role) => {
      role.permissions.forEach((permission) => {
        userPermissions.add(permission.name);
      });
    });

    res.status(200).json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        teams: user.teams.map((team) => team.name),
        roles: user.roles.map((role) => role.name),
        permissions: Array.from(userPermissions),
      },
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// assign custom role to user


exports.assignRoleToUserController = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    // Validate user and role existence
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const role = await roleModal.findById(roleId);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    // Check if user already has the role
    if (user.roles.includes(roleId)) {
      return res.status(400).json({
        success: false,
        message: "User is already assigned to this role",
      });
    }

    // Assign role to user
    user.roles.push(roleId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Role assigned to user successfully",
      user,
    });
  } catch (error) {
    console.error("Error assigning role to user:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

