const express = require('express')
const userModel = require('../models/userModel')
const sendOTPEmail = require('../utils/otpMail')
const { hashPassword, comparePassword } = require('../helpers/authHelper')
const JWT = require('jsonwebtoken')

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

exports.loginUserController = async (req, res) => {
    try {
        const {email,password}= req.body
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

    //JWT generation

    const token = await JWT.sign(
      { _id: existingUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "20d",
      }
    );

    
    res.status(200).json({
      success: true,
      message: "User Login Successful",
      token,
    });


    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}