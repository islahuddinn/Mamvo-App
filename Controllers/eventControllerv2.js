const Event = require("../Models/eventModelv2");
const catchAsync = require("../Utils/catchAsync");
const AppError = require("../Utils/appError");
const axios = require("axios");
const factory = require("./handleFactory");
const {calculateDistance} = require('../Helpers/DistanceCalculator')

//exports.getAllEvents = factory.getAll(Event);

exports.getAllEvents = catchAsync(async (req, res, next) => {
  const { lat, lon, radius, startDate, endDate } = req.query;

  // Fetch all events from the database
  let events = await Event.find();

  if (!events) {
    return next(new AppError("Error fetching events", 400));
  }

  // Filter events by location if latitude, longitude, and radius are provided
  if (lat && lon) {
    const userLat = parseFloat(lat);
    const userLon = parseFloat(lon);
    const maxDistance = radius ? parseFloat(radius) : 10; // Default to 10 km if radius is not provided

    events = events.filter(event => {
      const eventLat = event.location.latitude;
      const eventLon = event.location.longitude;
      const distance = calculateDistance(userLat, userLon, eventLat, eventLon);
      return distance <= maxDistance;
    });
  }

  // Filter events by date range if startDate and endDate are provided
  
    const currentDate = new Date()
    const start = startDate ? new Date(startDate) : currentDate;
    const end = endDate ? new Date(endDate) : new Date('2100-12-31');

    events = events.filter(event => {
      const eventStartDate = new Date(event.start_date);
      return eventStartDate >= start && eventStartDate <= end;
    });
  

  res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Events fetched successfully",
    length: events.length,
    events
  });
});

exports.getOneEvent = catchAsync(async (req, res, next) => {
  const { eventId } = req.params;
  if (!eventId) {
    return next(
      new AppError("Please select the event that you want to view", 400)
    );
  }

  const event = await Event.findOne({ eventId });
  if (!event) {
    return next(new AppError("Event with this ID doesn't exist", 404));
  }

  res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Event fetched successfully",
    event,
  });
});

exports.getUpComingEvents = catchAsync(async (req, res, next) => {
  try {
    const { organization_id, start_date, end_date, lat, lng, radius, limit } =
      req.query;
    const response = await axios.get(
      "https://channels-service-alpha.fourvenues.com/events",
      {
        params: {
          organization_id,
          start_date,
          end_date,
          lat,
          lng,
          radius,
          limit,
        },
        headers: {
          "X-Api-Key": process.env.API_KEY,
        },
      }
    );

    const events = response.data.data;

    if (!events) {
      return next(
        new AppError("Error while fetching the upcoming events", 400)
      );
    }

    res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Upcoming Events fetched successfully",
      length: events.length,
      events,
    });
  } catch (error) {
    console.log("ERROR WHILE FETCHING UPCOMING EVENTS:", error);
  }
});
