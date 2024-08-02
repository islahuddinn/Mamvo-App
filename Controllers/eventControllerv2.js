const Event = require('../Models/eventModelv2')
const catchAsync = require('../Utils/catchAsync')
const AppError = require('../Utils/appError')
const axios = require('axios')
const factory = require('./handleFactory')




exports.getAllEvents = factory.getAll(Event)

exports.getOneEvent = asyncHandler(async(req,res,next)=>{
    const {eventId} = req.params
    if(!eventId){
        return next(new CustomError("Please select the event that you want to view",400))
    }

    const event = await Event.findOne({eventId})
    if(!event){
        return next(new CustomError("Event with this ID doesn't exist",404))
    }

    res.status(200).json({
        status:"success",
        statusCode:200,
        message:"Event fetched successfully",
        event
    })
})