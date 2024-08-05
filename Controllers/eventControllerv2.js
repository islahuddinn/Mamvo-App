const Event = require("../Models/eventModelv2");
const catchAsync = require("../Utils/catchAsync");
const AppError = require("../Utils/appError");
const axios = require("axios");
const factory = require("./handleFactory");

exports.getAllEvents = factory.getAll(Event);

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
    const {organization_id, start_date, end_date, lat, lng, radius, limit} = req.query
    const response = await axios.get(
      `https://channels-service-alpha.fourvenues.com/events?organization_id=${organization_id}&start_date=${start_date}&end_date=${end_date}&lat=${lat}&lng=${lng}&radius=${radius}&limit=${limit}`,
      {
        headers: {
          "X-Api-Key": API_KEY,
        },
      }
    );

    const events = response.data.data

    if(!events){
        return next(new AppError("Error while fetching the upcoming events",400))
    }

    res.status(200).json({
        status:"success",
        statusCode:200,
        message:"Upcoming Events fetched successfully",
        events
    })

  } catch (error) {
    console.log("ERROR WHILE FETCHING UPCOMING EVENTS:", error);
  }
});
