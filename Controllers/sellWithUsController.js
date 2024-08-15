const catchAsync = require("../Utils/catchAsync");
const SellWithUs = require('../Models/sellWithUsModel')
const Email = require("../Utils/mailSend");
const AppError = require("../Utils/appError");
const RefreshToken = require('../Models/refreshTokenModel')
const Notification = require("../Models/notificationModel");
const {
  sendNotification,
  sendMulticastNotification,
} = require("../Utils/Notifications");





exports.createSellWithUs = catchAsync(async(req,res,next)=>{
    const {name,email,phoneNumber,addressInfo,description} = req.body

    const sellWithUs = await SellWithUs.create({
        name,
        email,
        phoneNumber,
        addressInfo,
        description
    })

    if(!sellWithUs){
        return next(new AppError("Could not create your sell with us request. Try Again!",400))
    }


    res.status(201).json({
        status:200,
        message:"Your request has been sent to admin",
        sellWithUs
    })
})




exports.getAllSellWithUsRequests = catchAsync(async(req,res,next)=>{
    const sellWithUs = await SellWithUs.find()


    res.status(200).json({
        status:"success",
        statusCode:200,
        message:"Sell with us requests fetched successfully",
        length: sellWithUs.length,
        sellWithUs
    })
})