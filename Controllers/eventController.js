const catchAsync = require("../Utils/catchAsync");
const Event = require("../Models/eventModel");
const User = require("../Models/userModel");
const factory = require("./handleFactory");
const Notification = require("../Models/notificationModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const {
  SendNotification,
  SendNotificationMultiCast,
} = require("../Utils/notification");

exports.createEvent = catchAsync(async (req, res, next) => {
  const {
    title,
    description,
    eventType,
    location,
    image,
    price,
    eventInfo,
    age,
    date,
    duration,
  } = req.body;

  const newEvent = new Event({
    title,
    description,
    eventType,
    location,
    image,
    price,
    eventInfo,
    age,
    date,
    duration,
  });

  const createdEvent = await newEvent.save();

  ////// Send Notification
  // const eventTitle = createdEvent.title;
  // const eventLocation = createdEvent.location;
  const data = {
    eventTitle: req.body.title,
    eventInfo: req.body.eventInfo,
    eventLocation: req.body.eventLocation,
  };
  const notificationTitle = "New Event Created";
  const notificationBody =
    "Hy Folks, another exciting event is going to be happen at eventLocation.";

  // const deviceToken = req.body.FCMToken;

  const devices = await User.find({}, "deviceToken");
  console.log(devices);
  const FCMTokens = devices.map((device) => device.deviceToken);
  console.log(FCMTokens);

  if (!FCMTokens) {
    return res.status(404).json({
      success: false,
      status: 404,
      message: "FCMTokens not found...",
    });
  }

  try {
    await SendNotificationMultiCast({
      tokens: FCMTokens,
      title: notificationTitle,
      body: notificationBody,
      data: data,
    });
    console.log("Notification sent to all users.");
  } catch (error) {
    console.error("Error sending notification.....:", error);
  }

  res.status(201).json({
    status: 201,
    success: true,
    event: createdEvent,
  });
});

//// get event by type
exports.getEventByType = catchAsync(async (req, res, next) => {
  const eventType = req.body.eventType;
  const user = req.user;

  if (!eventType) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Event type is required",
    });
  }

  try {
    const events = await Event.find({ eventType: eventType });

    if (!events.length) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Events not found for the provided event type",
      });
    }

    // Assuming you want to return multiple events for the provided event type
    return res.status(200).json({
      success: true,
      status: 200,
      data: {
        user: {
          userId: user._id,
          referralCode: user.referralCode,
        },
        events: events.map((event) => ({
          eventId: event.id,
          title: event.title,
          description: event.description,
          // Add other fields as needed
        })),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Internal server error",
    });
  }
});

//////  Get all event Locations

exports.getAllEventLocations = catchAsync(async (req, res, next) => {
  try {
    const events = await Event.find({}, "location");

    if (!events.length) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "No events found",
      });
    }

    const locations = events.map((event) => event.location);

    return res.status(200).json({
      success: true,
      status: 200,
      data: {
        locations: locations,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Internal server error",
    });
  }
});

/////// Update events

exports.updateEvent = catchAsync(async (req, res, next) => {
  const {
    name,
    slug,
    description,
    display_date,
    start_date,
    end_date,
    code,
    age,
    image_url,
    outfit,
    ambiences,
    music_genres,
    artists,
    organization_id,
    location_id,
    location,
    eventType,
  } = req.body;

  const eventId = req.params.id;

  try {
    const eventToUpdate = await Event.findById(eventId);

    if (!eventToUpdate) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "Event not found",
      });
    }

    // Update event fields
    eventToUpdate.name = name;
    eventToUpdate.slug = slug;
    eventToUpdate.description = description;
    eventToUpdate.display_date = display_date;
    eventToUpdate.start_date = start_date;
    eventToUpdate.end_date = end_date;
    eventToUpdate.code = code;
    eventToUpdate.age = age;
    eventToUpdate.image_url = image_url;
    eventToUpdate.outfit = outfit;
    eventToUpdate.ambiences = ambiences;
    eventToUpdate.music_genres = music_genres;
    eventToUpdate.artists = artists;
    eventToUpdate.organization_id = organization_id;
    eventToUpdate.location_id = location_id;
    eventToUpdate.location = location;
    eventToUpdate.eventType = eventType;

    const updatedEvent = await eventToUpdate.save();

    ////// Send Notification
    const data = {
      eventTitle: name,
      eventInfo: description,
      eventLocation: location.full_address,
    };
    const notificationTitle = "Event Updated";
    const notificationBody = "The event has been updated.";
    const devices = await User.find({}, "deviceToken");
    const FCMTokens = devices.map((device) => device.deviceToken);

    if (!FCMTokens.length) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "FCMTokens not found...",
      });
    }

    await Notification.create({
      title: notificationTitle,
      body: notificationBody,
      sender: req.user.id,
      multireceiver: FCMTokens,
      data: data,
    });

    try {
      await SendNotificationMultiCast({
        tokens: FCMTokens,
        title: notificationTitle,
        body: notificationBody,
        data: data,
      });
      console.log("Notification sent to all users.");
    } catch (error) {
      console.error("Error sending notification:", error);
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
});

////// Delete Event By Id
// exports.deleteEvent = catchAsync(async (req, res, next) => {
//   const eventId = req.params.id;
//   console.log(eventId);
//   try {
//     const eventToDelete = await Event.findById(eventId);
//     console.log(eventToDelete);
//     if (!eventToDelete) {
//       return res.status(404).json({
//         success: false,
//         status: 404,
//         message: "Event not found...",
//       });
//     }

//     // const eventTitle = eventToDelete.title;

//     await eventToDelete.deleteOne();

//     ////// Send Notification
//     const data = {
//       eventTitle: eventToDelete.title,
//       eventInfo: eventToDelete.eventInfo,
//       eventLocation: eventToDelete.eventLocation,
//     };
//     const notificationTitle = "Event Deleted";
//     const notificationBody = "The event  has been deleted successfully.";

//     // const deviceToken = req.body.FCMToken;
//     const devices = await User.find({}, "deviceToken");
//     console.log(devices);
//     const FCMTokens = devices.map((device) => device.deviceToken);
//     console.log(FCMTokens);

//     if (!FCMTokens) {
//       return res.status(404).json({
//         success: false,
//         status: 404,
//         message: "FCMTokens not found...",
//       });
//     }

//     try {
//       await SendNotificationMultiCast({
//         tokens: FCMTokens,
//         title: notificationTitle,
//         body: notificationBody,
//         data: data,
//       });
//       console.log("Notification sent to all users.");
//     } catch (error) {
//       console.error("Error sending notification.....:", error);
//     }

//     res.status(204).json({
//       success: true,
//       status: 204,
//       message: "Event deleted successfully",
//     });
//   } catch (error) {
//     next(error);
//   }
// });

exports.shareEvent = catchAsync(async (req, res, next) => {
  const user = req.user;
  console.log(user);
  let eventId = req.body.eventId || req.query.eventId;

  if (!eventId) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: "Event ID is required",
    });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, status: 404, message: "Event not found" });
    }

    const shareableLink = `${req.protocol}://${req.get(
      "host"
    )}/shared-event/${eventId}?referrer=${user._id}`;

    return res.status(200).json({
      success: true,
      status: 200,
      data: {
        user: {
          userId: user._id,
          referralCode: user.referralCode,
        },
        event: {
          eventId: event.id,
        },
        shareableLink: shareableLink,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, status: 500, message: "Internal server error" });
  }
});

///// Function to calculate and update cashback for the referral/Affiliate
exports.calculateAndUpdateCashback = catchAsync(async (eventId, referrerId) => {
  try {
    const event = await Event.findById(eventId);
    const cashbackAmount = event.price * 0.05; // 5% cashback

    // Update cashback for the referrer
    await User.findByIdAndUpdate(referrerId, {
      $inc: { walletBalance: cashbackAmount },
    });

    // Save the cashback information in the Referral model
    // await Referral.create({
    //   referrer: referrerId,
    //   event: eventId,
    //   walletBalance,
    // });
  } catch (error) {
    console.error("Error calculating and updating cashback:", error);
  }
});

//////// handle event booking with referral link

exports.bookEvent = catchAsync(async (req, res, next) => {
  const { eventId, userId } = req.body;
  const CashUpdate = this.calculateAndUpdateCashback;

  try {
    // Check if the user exists
    const user = await User.findById(userId);
    const event = await Event.findById(eventId);
    if (!user || !event) {
      return res.status(404).json({
        success: false,
        status: 404,
        message: "User or event not found.",
      });
    }

    // Check if the user is a PR user
    if (user.isPRUser) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "Public Relation users are not allowed to book events.",
      });
    }

    let paymentIntent;

    // Check if the user has a referral code and it's valid
    if (user.referralCode) {
      const referrer = await User.findOne({ referralCode: user.referralCode });
      if (referrer) {
        // Update cashback for the referrer
        CashUpdate(eventId, referrer._id);
        // Proceed with Stripe payment integration
        paymentIntent = await stripe.paymentIntents.create({
          amount: event.price * 100, // Set your desired amount in cents (e.g., 10 USD)
          currency: "usd",
          description: "Event Booking",
          automatic_payment_methods: {
            enabled: true,
          },
        });
        // Confirm the payment intent to complete the payment
        const confirmedPaymentIntent = await stripe.paymentIntents.confirm(
          paymentIntent.id,
          {
            payment_method: "pm_card_visa",
            return_url: "https://www.example.com",
          }
        );
        return res.status(200).json({
          success: true,
          status: 200,
          message: "Event booked successfully.",
          data: { user, paymentIntent: confirmedPaymentIntent },
        });
      }
    }

    // If no referral code or it's invalid, proceed with Stripe payment integration
    if (!paymentIntent) {
      paymentIntent = await stripe.paymentIntents.create({
        amount: event.price * 100, // Set your desired amount in cents (e.g., 10 USD)
        currency: "usd",
        description: "Event Booking",
        automatic_payment_methods: { enabled: true },
      });
    }
    // Confirm the payment intent to complete the payment
    const confirmedPaymentIntent = await stripe.paymentIntents.confirm(
      paymentIntent.id,
      {
        payment_method: "pm_card_visa",
        return_url: "https://www.example.com",
      }
    );
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Event booked successfully.",
      data: { user, paymentIntent: confirmedPaymentIntent },
    });
  } catch (error) {
    // Handle any errors
    return res.status(500).json({
      success: false,
      status: 500,
      message: "Internal server error.",
      error: error.message,
    });
  }
});

//// function to cancel the book event
exports.getallEvent = factory.getAll(Event);
exports.getOneEvent = factory.getOne(Event);
exports.deleteEvent = factory.deleteOne(Event);
