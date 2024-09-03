const ContactUs = require('../Models/contactUsModel')
const AppError = require("../Utils/appError");
const catchAsync = require("../Utils/catchAsync");
const factory = require("./handleFactory");
const he = require('he')

exports.createContactUs = catchAsync(async(req,res,next)=>{
    const {email,phone,content} = req.body
    const existingContactUs = await ContactUs.find()
    if(existingContactUs.length > 0){
        return next(new AppError("Contact Us details already exist. You can update existing details.", 400))
    }
    const contact = await ContactUs.create({
        email,
        content,
        phone,
        createdBy: req.user._id
    })

    if(!contact){
        return next(new AppError("Error creating Contact Us. Try Again!!!", 400))
    }
    res.status(201).json({
        status:"success",
        statusCode: 201,
        message:"Contact Us created successfully",
        contact
    })
})


exports.getContactUs = factory.getOne(ContactUs)
exports.updateContactUs = factory.updateOne(ContactUs)
exports.deleteContactUs = factory.deleteOne(ContactUs)
exports.getAllContactUs = factory.getAll(ContactUs)

