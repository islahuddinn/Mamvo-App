const Event = require("../Models/eventModelv2");
const catchAsync = require("../Utils/catchAsync");
const AppError = require("../Utils/appError");
const axios = require("axios");
const factory = require("./handleFactory");
const { calculateDistance } = require("../Helpers/DistanceCalculator");
const preFilteredDataPagination = require("../Utils/preFilteredDataPagination");

//exports.getAllEvents = factory.getAll(Event);

exports.getAllEvents = catchAsync(async (req, res, next) => {
  const { lat, lon, radius, startDate, endDate, genres, category } = req.query;

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

    events = events.filter((event) => {
      const eventLat = event.location.latitude;
      const eventLon = event.location.longitude;
      const distance = calculateDistance(userLat, userLon, eventLat, eventLon);
      return distance <= maxDistance;
    });
  }

  // Filter events by date range if startDate and endDate are provided

  const currentDate = new Date();
  const start = startDate ? new Date(startDate) : currentDate;
  const end = endDate ? new Date(endDate) : new Date("2100-12-31");

  events = events.filter((event) => {
    const eventStartDate = new Date(event.start_date);
    return eventStartDate >= start && eventStartDate <= end;
  });

  
  const genreCategories = {
    all: [
      "urban",
      "pop",
      "rock",
      "remember",
      "techno",
      "house",
      "edm",
      "trap",
      "reggaeton",
      "latin",
      "salsa",
      "bachata",
      "kizomba",
      "r&b",
      "dance",
      "indie",
      "afrobeat",
      "minimal",
      "underground",
      "tech-house",
      "drum-and-bass",
      "acid-house",
      "chill",
      "hard-techno",
      "melodic-techno",
      "hip-hop",
      "reggae",
      "disco",
      "sing-along",
      "acoustic",
      "trance",
      "classical",
      "soul",
      "blues",
      "jazz",
      "metal",
      "old-school",
      "garage",
      "hardcore"
    ],
    electronica: [
      "techno",
      "house",
      "edm",
      "minimal",
      "tech-house",
      "drum-and-bass",
      "acid-house",
      "hard-techno",
      "melodic-techno",
      "trance",
      "garage",
      "hardcore"
    ],
    comercial: [
      "hits",
      "urban",
      "pop",
      "rock",
      "remember",
      "dance",
      "indie",
      "afrobeat",
      "chill",
      "disco",
      "sing-along",
      "acoustic",
      "classical",
      "soul",
      "blues",
      "jazz",
      "metal",
      "old-school",
      "r&b",
      "hip-hop",
      "reggae",
    ],
    regueton: ["reggaeton", "latin", "salsa", "bachata", "kizomba", "trap"],
  };
  const getParentGenres = (musicGenres) => {
    return Object.keys(genreCategories).filter((parent) =>
      genreCategories[parent].some((g) => musicGenres.includes(g))
    );
  };

  // Add parentMusicGenre field to each event
  events = events.map((event) => {
    const eventGenres = event.music_genres.map((g) => g.toLowerCase());
    const parentMusicGenres = getParentGenres(eventGenres);

    return {
      ...event.toObject(),
      parentMusicGenres,
    };
  });

  if (genres || category) {
    // Define genre categories if not defined above

    // Get selected genres from query or from the category mapping
    const selectedGenres = genres
      ? genres.split(",").map((g) => g.toLowerCase())
      : genreCategories[category.toLowerCase()] || [];

    // Filter events where at least one genre matches the selected genres
    events = events.filter((event) => {
      const eventGenres = event.music_genres.map((genre) =>
        genre.toLowerCase()
      );
      return eventGenres.some((genre) => selectedGenres.includes(genre));
    });
  }
  console.log("REQ_QUERY ISSS::::", req.query);

  console.log("----------------------------------------------------");

  console.log("EVENTS IN GET ALL EVENTS AFTER FILTRATION:", events);

  const paginatedEvents = preFilteredDataPagination(req, events);

  console.log("PAGINATED EVENTS DATA:", paginatedEvents.data);
  console.log("PAGINATED EVENTS TOTAL PAGES:", paginatedEvents.totalPages);
  console.log(
    "PAGINATED EVENTS TOTAL AVAILALBE:",
    paginatedEvents.totalavailables
  );

  res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Events fetched successfully",
    length: paginatedEvents.data.length,
    totalPages: paginatedEvents.totalPages,
    hasPrevPage: paginatedEvents.hasPrevPage,
    hasNextPage: paginatedEvents.hasNextPage,
    //totalResults: paginatedEvents.totalavailables,
    events: paginatedEvents.data,
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

exports.createCustomEvent = catchAsync(async (req, res, next) => {
  const {
    name,
    description,
    start_date,
    end_date,
    image_url,
    outfit,
    ambiences,
    music_genres,
    location,
    eventUrl,
    age,
  } = req.body;

  if (
    !name ||
    !description ||
    !start_date ||
    !end_date ||
    !image_url ||
    !outfit ||
    !ambiences ||
    !music_genres ||
    !location ||
    !eventUrl
  ) {
    return next(
      new AppError("Please provide all fields while creating event", 400)
    );
  }

  const customEvent = await Event.create({
    name,
    description,
    start_date,
    end_date,
    image_url,
    outfit,
    ambiences,
    music_genres,
    location,
    eventUrl,
    age,
    isCustom: true,
  });

  if (!customEvent) {
    return next(
      new AppError("Error while creating custom event. Try Again!", 400)
    );
  }

  customEvent.eventId = customEvent._id;
  await customEvent.save();

  res.status(200).json({
    status: "success",
    statusCode: 200,
    message: "Custom Event added successfully",
    customEvent,
  });
});

exports.deleteEvent = factory.deleteOne(Event);
exports.updateEvent = factory.updateOne(Event);
