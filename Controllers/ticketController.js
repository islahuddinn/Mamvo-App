const Ticket = require("../Models/ticketModelv2");
const catchAsync = require("../Utils/catchAsync");
const AppError = require("../Utils/catchAsync");
const axios = require("axios");

exports.bookTicket = catchAsync(async (req, res, next) => {
  const { ticket_rate_id, tickets } = req.body;

  if (!ticket_rate_id || !tickets.length) {
    return next(
      new AppError("Please provide both ticket rate id and ticket details", 400)
    );
  }

  console.log("HITTING POST REQUEST")
  console.log("-----------------------------------------------------------")
  console.log("REQ_BODY IS:", req.body)

  console.log("TICKET_RATE_ID_IS:", ticket_rate_id)
  console.log("TICKETS IN BODY IS:", tickets)

  console.log("--------------------------------------------------------")

  try {
    const response = await axios.post(
      "https://channels-service-alpha.fourvenues.com/tickets/checkout",
      {
        redirect_url: "http://ec2-35-171-3-147.compute-1.amazonaws.com/tickets/success",
        error_url:"http://ec2-35-171-3-147.compute-1.amazonaws.com/tickets/fail",
        //send_resourcers: true,
        metadata:{
          userId: req.user._id
        },
        ticket_rate_id,
        tickets,
      },
      {
        headers: {
          "X-Api-Key": process.env.API_KEY,
        },
      }
    );

    console.log("RESPOONSE IN BOOK TCIKET IS:::::::::::::", response)
  
    const booking = response.data.data


  
    if(!booking){
        return next(new AppError("Error while booking the ticket ",404))
    }

    res.status(200).json({
        status:"success",
        statusCode:200,
        message:"Please proceed to the payment. You'll receive email of the ticket shortly after the successful payment.",
        booking
    })
  } catch (error) {
    console.log("ERROR WHILE BOOKING TICKET:", error)

    console.log("DETAIL ERROR", error.response.data.message)
  }
});







