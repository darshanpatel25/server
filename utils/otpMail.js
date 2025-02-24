const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, 
    pass: process.env.EMAIL_PASSWORD, 
  },
});


const sendOTPEmail = async (email, otp) => {
  try {
    await transporter.sendMail({
      from: "21i426@bvmengineering.ac.in",
      to: email,
      subject: "OTP for Verification",
      html: `
     <!DOCTYPE html>
     <html lang="en">
     <head>
         <meta charset="UTF-8">
         <meta name="viewport" content="width=device-width, initial-scale=1.0">
         <title>OTP Email</title>
     </head>
     <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
         <div style="background-color: #fff; border-radius: 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); padding: 20px; width: 300px; margin: 0 auto;">
             <h2 style="text-align: center;">OTP Verification</h2>
             
             <p>Dear User,</p>
             <p>Your OTP for verification is: </p>
             <h1>${otp}</h1>
             <p>Please use this OTP to complete the verification process.</p>
             <p>If you didn't request this OTP, please ignore this email.</p>
             <p>Best regards,<br>Darshan Bhensdadia</p>
         </div>
     </body>
     </html>
 `,
    });
  } catch (error) {
    console.error("Error while sending OTP email");
  }
};

module.exports = sendOTPEmail;