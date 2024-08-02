const TicketRate = require('../Models/ticketRateModelv2')
const Event = require('../Models/eventModelv2')
const catchAsync = require('../Utils/catchAsync')
const AppError = require('../Utils/appError')
const axios = require('axios')




exports.getAllTicketRatesOfEvent = catchAsync(async(req,res,next)=>{
    const {eventId} = req.params
    if(!eventId){
        return next(new AppError("Please select the event to get its ticket rates",400))
    }

    const event = await Event.findOne({eventId})
    if(!event){
        return next(new AppError("Event with this ID doesn't exist",404))
    }

    const ticketRates = await TicketRate.find({event_id:eventId})
    if(!ticketRates){
        return next(new AppError("Error fetching ticket rates.",400))
    }
    
    res.status(200).json({
        status:"success",
        statusCode:200,
        length: ticketRates.length,
        message:"Ticket Rates for this event fetched successfully",
        ticketRates
    })
})


exports.getOneTicketRate = catchAsync(async(req,res,next)=>{
    const {ticketRateId} = req.params
    if(!ticketRateId){
        return next(new AppError("Please select the ticket rate that you want to view",400))
    }

    const ticketRate = await TicketRate.findOne({ticketRateId})
    if(!ticketRate){
        return next(new AppError("Ticket rate with this ID doesn't exist.",404))
    }

    res.status(200).json({
        status:"success",
        statusCode:200,
        message:"Ticket Rate fetched successfully",
        ticketRate
    })
})



exports.getTicketRatePricingInfo = catchAsync(async(req,res,next)=>{
    console.log("API HIT FOR PRICING INFO")
    const {ticketRateId} = req.params
    const {quantity} = req.query

    if(!ticketRateId || !quantity){
        return next(new AppError("Please selecth the both ticket rate and quantity",400))
    }

    const response = await axios.get(`https://channels-service-alpha.fourvenues.com/ticket-rates/${ticketRateId}/pricing-info?quantity=${quantity}`, {
        headers: {
            "X-Api-Key": process.env.API_KEY,
          },
    })

    const pricingInfo = response.data.data

    console.log("PRICING INFO", pricingInfo)

    if(!pricingInfo){
        return next(new CustomError("No Pricing Info found for this ticket rate.", 404))
    }

    res.status(200).json({
        status:"success",
        statusCode:200,
        message:"Pricing Info fetched successfully",
        pricingInfo
    })

})