const mongoose = require('mongoose')

const userSchmea = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    access: {
        type: Number,
        required: true,
        default: 0
    },
    team: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "team"
        }
    ],
   
   
    isVerified:{
        type:Boolean,
        required:true,
        default:true
    }
})

module.exports = mongoose.model("user",userSchmea)