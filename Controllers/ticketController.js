const Ticket = require("../Models/ticketModelv2");
const Event = require("../Models/eventModelv2");
const User = require("../Models/userModel");
const TicketRate = require("../Models/ticketRateModelv2");
const catchAsync = require("../Utils/catchAsync");
const AppError = require("../Utils/catchAsync");
const axios = require("axios");
const crypto = require("crypto");
const RefreshToken = require("../Models/refreshTokenModel");
const Notification = require("../Models/notificationModel");
const {
  sendNotification,
  sendMulticastNotification,
} = require("../Utils/Notifications");

exports.bookTicket = catchAsync(async (req, res, next) => {
  const { ticket_rate_id, tickets } = req.body;

  if (!ticket_rate_id || !tickets.length) {
    return next(
      new AppError("Please provide both ticket rate id and ticket details", 400)
    );
  }

  console.log("HITTING POST REQUEST");
  console.log("-----------------------------------------------------------");
  console.log("REQ_BODY IS:", req.body);

  console.log("TICKET_RATE_ID_IS:", ticket_rate_id);
  console.log("TICKETS IN BODY IS:", tickets[0]);

  console.log("--------------------------------------------------------");

  try {
    const response = await axios.post(
      "https://channels-service-alpha.fourvenues.com/tickets/checkout",
      {
        redirect_url: "https://api.mamvoapp.com/tickets/success",
        error_url: "https://api.mamvoapp.com/tickets/fail",
        //send_resourcers: true,
        // metadata:{
        //   userId: req.user._id
        // },
        ticket_rate_id,
        tickets,
      },
      {
        headers: {
          "X-Api-Key": process.env.API_KEY,
        },
      }
    );

    console.log("RESPOONSE IN BOOK TCIKET IS:::::::::::::", response);

    const booking = response.data.data;

    if (!booking) {
      return next(new AppError("Error while booking the ticket ", 404));
    }

    const { userId } = req.body;
    if (userId) {
      console.log(
        "--------------------- USER ID EXISTS ------------------------"
      );
      const user = await User.findById(userId);
      if (!user) {
        return next(new CustomError("User with this ID doesn't exist", 404));
      }
      const paymentId = booking.payment_id;
      for (const ticket of booking.tickets) {
        await Ticket.create({
          eventId: ticket?.event_id,
          ticketRateId: ticket?.ticket_rate_id,
          ticketId: ticket?._id,
          qrCode: ticket?.qr_code,
          status: ticket?.status,
          price: {
            priceId: ticket?.price?._id,
            name: ticket?.price?.name,
            price: ticket?.price?.price,
            feeType: ticket?.price?.fee_type,
            feeQuantity: ticket?.price?.fee_quantity,
            includes: ticket?.price?.includes,
            additionalInfo: ticket?.price?.additional_info || "",
          },
          channelId: ticket?.channel_id,
          fees: {
            organization: ticket?.fees?.organization,
          },
          fullName: ticket?.full_name,
          phone: ticket?.phone,
          email: ticket?.email,
          gender: ticket?.gender,
          birthday: ticket?.birthday,
          address: ticket?.address,
          postalCode: ticket?.postal_code,
          countryCode: ticket?.country_code,
          answers: ticket?.answers.map((answer) => ({
            questionId: answer?.questionId,
            answer: answer?.answer,
          })),
          supplements: ticket?.supplements.map((supplement) => ({
            supplementId: supplement?.supplementId,
            label: supplement?.label,
            price: supplement?.price,
          })),
          refunded: ticket?.refunded,
          refunds: ticket?.refunds.map((refund) => ({
            channelId: refund?.channelId,
            amount: refund?.amount,
            at: refund?.at,
          })),
          for: ticket?.for,
          enter: ticket?.enter,
          totalSupplements: ticket?.total_supplements,
          totalFees: ticket?.total_fees,
          totalPrice: ticket?.total_price,
          userId: user._id,
          userType: "registered-user",
          paymentId,
        });
      }
    } else {
      const paymentId = booking.payment_id;
      for (const ticket of booking.tickets) {
        await Ticket.create({
          eventId: ticket?.event_id,
          ticketRateId: ticket?.ticket_rate_id,
          ticketId: ticket?._id,
          qrCode: ticket?.qr_code,
          status: ticket?.status,
          price: {
            priceId: ticket?.price?._id,
            name: ticket?.price?.name,
            price: ticket?.price?.price,
            feeType: ticket?.price?.fee_type,
            feeQuantity: ticket?.price?.fee_quantity,
            includes: ticket?.price?.includes,
            additionalInfo: ticket?.price?.additional_info,
          },
          channelId: ticket?.channel_id,
          fees: {
            organization: ticket?.fees?.organization,
          },
          fullName: ticket?.full_name,
          phone: ticket?.phone,
          email: ticket?.email,
          gender: ticket?.gender,
          birthday: ticket?.birthday,
          address: ticket?.address,
          postalCode: ticket?.postal_code,
          countryCode: ticket?.country_code,
          answers: ticket?.answers.map((answer) => ({
            questionId: answer?.questionId,
            answer: answer?.answer,
          })),
          supplements: ticket?.supplements.map((supplement) => ({
            supplementId: supplement?.supplementId,
            label: supplement?.label,
            price: supplement?.price,
          })),
          refunded: ticket?.refunded,
          refunds: ticket?.refunds.map((refund) => ({
            channelId: refund?.channelId,
            amount: refund?.amount,
            at: refund?.at,
          })),
          for: ticket?.for,
          enter: ticket?.enter,
          totalSupplements: ticket?.total_supplements,
          totalFees: ticket?.total_fees,
          totalPrice: ticket?.total_price,
          userType: "guest-user",
          paymentId,
        });
      }
    }

    res.status(200).json({
      status: "success",
      statusCode: 200,
      message:
        "Please proceed to the payment. You'll receive email of the ticket shortly after the successful payment.",
      booking,
    });
  } catch (error) {
    console.log("ERROR WHILE BOOKING TICKET:", error);

    console.log("DETAIL ERROR", error.response.data.errors);
  }
});



exports.verifyTicketStatus = catchAsync(async (req, res, next) => {
  console.log("WEBHOOK TRIGGERED!!!");
  const signature = req.headers["x-webhook-signature"];
  const body = JSON.stringify(req.body);
  const secret = "whsec_5ASuhLYeJUoK8MoCcUOYKKQEmkgiQMscCWkSIUY8eeu"; // Replace with your actual webhook secret key

  const hmacSha256 = (input, key) => {
    const hmac = crypto.createHmac("sha256", key);
    hmac.update(input);
    return hmac.digest("hex");
  };

  // Calculate the signature
  const calculatedSignature = hmacSha256(body, secret);

  console.log("SIGNATURE IN WEBHOOK IS:", signature);
  console.log("CALC_SIGNATURE IN WEBHOOK IS:", calculatedSignature);

  // Validate the signature
  if (signature !== calculatedSignature) {
    return res.status(401).send("Invalid signature");
  }
  console.log("REQ.BODY IN WEBHOOK IS:::", req.body);
  const event = req.body.event;

  console.log("EVENT IN WEBHOOK IS:", event);

  // Handle the payment.success event
  if (event === "payment.success") {
    const paymentId = req.body.object.payment_id;

    console.log("Payment successful!");
    console.log("Payment ID:", paymentId);

    const tickets = await Ticket.find({ paymentId });

    console.log("TICKETS ARE:", tickets);

    for (const ticket of tickets) {
      console.log("-------------------EXECUTING FOR LOOP--------------------");
      console.log("-----------TICKET_STATUS IS:", ticket.status);
      if (ticket.status === "pending_payment") {
        console.log(
          "-----------------TICKET STATUS IS PENDING CHANGING TICKET STATUS------------------"
        );
        ticket.status = "active";

        await ticket.save();
        if (ticket.userType === "registered-user") {
          const event = await Event.findOne({ eventId: ticket.eventId });
          await Notification.create({
            notificationType: "ticket-booked",
            receiver: ticket.userId._id,
            title: "Ticket Booked successfully",
            body: `Your have successfully booked the ticket for ${event.name} .`,
            data: ticket,
          });
          const fcmTokens = await RefreshToken.find({
            user: ticket.userId._id,
          }).then((tokens) => tokens.map(({ deviceToken }) => deviceToken));

          console.log("FCM TOKENS ARE:", fcmTokens);

          if (ticket.userId.isNotifications && fcmTokens.length > 1) {
            await sendMulticastNotification({
              fcmTokens,
              title: "Ticket Booked successfully",
              body: `Your have successfully booked the ticket for ${event.name} .`,
              notificationData: JSON.stringify(ticket),
            });
          } else if (user.isNotifications && fcmTokens.length === 1) {
            await sendNotification({
              fcmToken: fcmTokens[0],
              title: "Ticket Booked successfully",
              body: `Your have successfully booked the ticket for ${event.name} .`,
              notificationData: JSON.stringify(ticket),
            });
          }
        }
      }
    }

    console.log(
      "----------------------SENDING RESPONSE FOR VERIFYING TICKET---------------------"
    );

    res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Payment is successfull",
      tickets,
    });
  } else {
    return next(new CustomError("Unhandled Event in Payment Webhook", 400));
  }
});

// exports.getMyBookedTickets = catchAsync(async (req, res, next) => {
//   const tickets = await Ticket.find({
//     status: "active",
//     userId: req.user._id,
//     userType: "registered-user",
//   }).sort("-createdAt");

//   console.log("TICKETS ARE:::::", tickets);

//   const ticketsCopy = JSON.parse(JSON.stringify(tickets));
//   const groupedTickets = {};

//   for (const ticket of ticketsCopy) {
//     const event = await Event.findOne({ eventId: ticket.eventId });
//     if (!event) {
//       return next(
//         new AppError("Could not find associated event with this ticket", 404)
//       );
//     }

//     const ticketRate = await TicketRate.findOne({
//       ticketRateId: ticket.ticketRateId,
//     });
//     if (!ticketRate) {
//       return next(
//         new AppError(
//           "Could not find associated ticket rate with this ticket",
//           404
//         )
//       );
//     }
//     ticket.eventName = event.name;
//     ticket.eventImage = event.image_url;
//     ticket.eventStartDate = event.start_date;
//     ticket.eventEndDate = event.end_date;
//     ticket.eventLocation = event.location;
//     ticket.ticketName = ticketRate.name;
    
//     const groupKey = `${ticket.paymentId}_${ticket.userId}_${ticket.eventId}`;
//     if (!groupedTickets[groupKey]) {
//       groupedTickets[groupKey] = {
//         paymentId: ticket.paymentId,
//         eventId: ticket.eventId,
//         userId: ticket.userId,
//         tickets: [],
//       };
//     }

//     groupedTickets[groupKey].tickets.push(ticket);
//   }

//   console.log("-------------------------------------------------------");
//   const groupedTicketsArray = Object.values(groupedTickets);

//   console.log("TICKETS COPY ARE::::", groupedTicketsArray);

//   res.status(200).json({
//     status: "success",
//     statusCode: 200,
//     message: "Tickets fetched succesfully",
//     length: groupedTicketsArray.length,
//     tickets: groupedTicketsArray,
//   });
// });



exports.getMyBookedTickets = catchAsync(async (req, res, next) => {
  const tickets = await Ticket.find({
    status: "active",
    userId: req.user._id,
    userType: "registered-user",
  }).sort("-createdAt");

  // Create a copy of the tickets
  const ticketsCopy = JSON.parse(JSON.stringify(tickets));
  const groupedTickets = {};

  for (const ticket of ticketsCopy) {
    // Fetch related event and ticket rate
    const event = await Event.findOne({ eventId: ticket.eventId });
    if (!event) {
      return next(new AppError("Could not find associated event with this ticket", 404));
    }

    const ticketRate = await TicketRate.findOne({ ticketRateId: ticket.ticketRateId });
    if (!ticketRate) {
      return next(new AppError("Could not find associated ticket rate with this ticket", 404));
    }

    // Add event and ticket details to the ticket object
    ticket.eventName = event.name;
    ticket.eventImage = event.image_url;
    ticket.eventStartDate = event.start_date;
    ticket.eventEndDate = event.end_date;
    ticket.eventLocation = event.location;
    ticket.ticketName = ticketRate.name;

    // Group tickets by paymentId, userId, and eventId
    const groupKey = `${ticket.paymentId}_${ticket.userId}_${ticket.eventId}`;
    if (!groupedTickets[groupKey]) {
      groupedTickets[groupKey] = {
        paymentId: ticket.paymentId,
        eventId: ticket.eventId,
        userId: ticket.userId,
        eventName: ticket.eventName,
        eventImage: ticket.eventImage,
        eventStartDate: ticket.eventStartDate,
        eventEndDate: ticket.eventEndDate,
        eventLocation: ticket.eventLocation,
        ticketName: ticket.ticketName,
        price: ticket.price,
        tickets: [],
      };
    }

    // Push only the unique fields (like qrCode) into the tickets array
    groupedTickets[groupKey].tickets.push({
      qrCode: ticket.qrCode,
      // ticketId: ticket.ticketId,
      // channelId: ticket.channelId,
      // fullName: ticket.fullName,
      // phone: ticket.phone,
      // email: ticket.email,
      // status: ticket.status,
      // totalFees: ticket.totalFees,
      // totalPrice: ticket.totalPrice,
      // createdAt: ticket.createdAt,
      // updatedAt: ticket.updatedAt,
    });
  }

  const groupedTicketsArray = Object.values(groupedTickets);

  res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Tickets fetched successfully",
    length: groupedTicketsArray.length,
    tickets: groupedTicketsArray,
  });
});
