const TicketRate = require('../Models/ticketRateModelv2')
const Event = require('../Models/eventModelv2')
const catchAsync = require('../Utils/catchAsync')
const AppError = require('../Utils/appError')




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