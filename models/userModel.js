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
    contact: {
        type: String,
        required: true
    },
    otp: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model("user",userSchmea)