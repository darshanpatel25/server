const contactModel = require("../models/contactModel")

exports.createContactController = async(req,res)=>{
    try {
        const {name,number,email,birthday,address,nickname}=req.body
        const id = req.user._id
        const existingContact =await contactModel.findOne({number})
        if(existingContact){
            return res.status(200).json({
                success:false,
                message:"Contact Already Exists"
            })
        }
        const contact =await new contactModel({
            name,
            number,
            owner:id,
            email,
            address,
            birthday,
            address,
            nickname
        }).save()

        res.status(200).json({
            success:true,
            message:"Contact Created Successfully",
            contact
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}