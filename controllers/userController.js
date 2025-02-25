const express = require('express')
const userModel = require('../models/userModel')
const sendOTPEmail = require('../utils/otpMail')
const { hashPassword, comparePassword } = require('../helpers/authHelper')
const JWT = require('jsonwebtoken')
const Team = require("../models/teamModel");

// register

exports.registerUserController = async (req, res) => {
    try {
        //otp
        // const otp = Math.floor(1000 + Math.random() * 9000)

        // console.log(req)
        //data from body
        const { name, password, email } = req.body


        //findind duplicacy

        const exUser = await userModel.findOne({ email: email.toLowerCase() })
        const HasedPassword = await hashPassword(password)
        if (exUser) {

            return res.status(409).json({
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
      user: { _id: existingUser._id, name: existingUser.name, access: existingUser.access }, 
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
    const user = userModel.findById(req.user._id);
    console.log(req.user._id);

    const hashedPassword = password ? await hashPassword(password) : undefined;

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
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

exports.getAllUsersController = async(req,res)=>{
  try {
    const users =await userModel.find()
    res.status(200).json({
      success:true,
      users
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success:false,
      message:"Internal Server Error"
    })
  }
}

