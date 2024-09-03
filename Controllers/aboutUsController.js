const AboutUs = require('../Models/aboutUsModel')
const AppError = require("../Utils/appError");
const catchAsync = require("../Utils/catchAsync");
const factory = require("./handleFactory");
const he = require('he')

// exports.createAboutUs = catchAsync(async(req,res,next)=>{
//     const {title,content} = req.body
//     const about = await AboutUs.create({
//         title,
//         content,
//         createdBy: req.user._id
//     })

//     if(!about){
//         return next(new AppError("Error creating About Us. Try Again!!!", 400))
//     }
//     res.status(201).json({
//         status:"success",
//         statusCode: 201,
//         message:"About Us created successfully",
//         about
//     })
// })

exports.getAboutUs = factory.getOne(AboutUs)
//exports.updateAboutUs = factory.updateOne(AboutUs)
exports.deleteAboutUs = factory.deleteOne(AboutUs)
//exports.getAllAboutUs = factory.getAll(AboutUs)

exports.updateAboutUs = catchAsync(async(req,res,next)=>{

    const encodedResponse = req.body.content
    const decodedResponse = he.decode(encodedResponse); // Decode the HTML entities
    req.body.content = decodedResponse

    const aboutUs = await AboutUs.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

    if(!aboutUs){
        return next(new AppError("Could not update about us!", 400))
    }
    res.status(200).json({
        status:"success",
        statusCode:200,
        data:{
            aboutUs
        }
    })

})


exports.getAllAboutUs = catchAsync(async(req,res,next)=>{
    const aboutUs = await AboutUs.findOne()
    if(!aboutUs){
        return next(new AppError("Error fetching about details",400))
    }

    res.status(200).json({
        status:"success",
        statusCode:200,
        message:"About details fetched successfully",
        aboutUs
    })
})

exports.createAboutUs = catchAsync(async(req,res,next)=>{
    

    const existingAboutUs = await AboutUs.find()
    if(existingAboutUs.length > 0){
        return next(new AppError("You cannot create new about details.Instead edit the existing abooutUs.",400))
    }

    console.log("TESTING CREATE ABOUT USSSSSSSSSSSSs")

    console.log("REQ>BODY>CONTENT IS:", req.body.content)

    const encodedResponse = req.body.content
    console.log("ENCODED RESPONSE IS:::::::::", encodedResponse)
    const decodedResponse = he.decode(encodedResponse); // Decode the HTML entities
    console.log("DECODED RESPONSE IS:::::::", decodedResponse)
    req.body.content = decodedResponse


    console.log("REQ>BODY>CONTENT>AFTER IS:", req.body.content)
    const aboutUs = await AboutUs.create(req.body)

    if(!aboutUs){
        return next(new AppError("Error creating new about us details. Try Again!!!", 400))
    }
    res.status(201).json({
        status:"success",
        statusCode: 201,
        message:"about us details created successfully",
        aboutUs
    })
})