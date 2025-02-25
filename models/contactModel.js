import mongoose, { mongo } from "mongoose";

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
    }
})

module.exports = mongoose.model("Contact",contactSchema)