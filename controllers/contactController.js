const contactModel = require("../models/contactModel")

//create contact

exports.createContactController = async(req,res)=>{
    try {
        const {name,number,email,birthday,address,nickname}=req.body
        const id = req.headers.id
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

// update contact controller

exports.updateContactController=async(req,res)=>{
    try {
        
        const {name,number,email,birthday,address,nickname}=req.body
        const contact = await contactModel.findOne({number})
        const cid = contact._id
        console.log(contact)

        const updatedContact =await contactModel.findByIdAndUpdate(cid,{
            name,
            email,
            birthday,
            address,
            nickname

        },{new:true})

        res.status(200).json({
            success:true,
            message:"Contact Updated Successfully",
            updatedContact
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Internal Server Error",
        })
    }
}

//get all contacts controller

exports.getAllContactsController = async(req,res)=>{
    try {
        const contacts = await contactModel.find()
        res.status(200).json({
            success:true,
            message:"Contacts Fetched Successfully",
            contacts
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

//get single contact details

exports.getSingleContactController = async(req,res)=>{
    try {
        const cid = req.params.id
        const contact = await contactModel.findById(cid)

        if(!contact){
            return res.status(404).json({
                success:false,
                message:"Contact Not Found"
            })
        }
        res.status(200).json({
            success:true,
            message:"Contact Found",
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

//delete contact controller

exports.deleteContactController = async(req,res)=>{
    try {

        const cid = req.params.id

        const contact = await contactModel.findByIdAndDelete(cid)

        if(!contact){
            return res.status(404).json({
                success:false,
                message:"Contact Not Found"
            })
        }

        res.status(200).json({
            success:true,
            message:"Contact Deleted Successfully"
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}