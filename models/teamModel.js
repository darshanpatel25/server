import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    permissions:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Permission"
    }]
})

module.exports = mongoose.model('Team',teamSchema)