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
    teams: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team"
        }
    ],


    isVerified: {
        type: Boolean,
        required: true,
        default: true
    },
    
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
    }]
})

module.exports = mongoose.model("User", userSchmea)