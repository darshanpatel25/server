const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    contact:{
        type: Number,
        required:true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    email:{
        type: String,
    },
    birthday:{
        type:Date
    },
    nickname:{
        type:String
    },
    address:{
        type:String
    }
})

module.exports = mongoose.model("Contact",contactSchema)