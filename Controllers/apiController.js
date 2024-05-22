const axios = require("axios");
const { URL } = require("url");
const Event = require("../Models/eventModel");

exports.fetchDataFromAPI = async (req, res, next) => {
  console.log("END POINT HITTED");
  const apiLink = process.env.API_BASE_URL;
  const apiKey = process.env.API_KEY;

  // Log environment variables for debugging
  console.log("API Base URL:", apiLink);
  console.log("API Key:", apiKey);

  // Check if environment variables are properly set
  if (!apiLink || !apiKey) {
    console.error(
      "API_BASE_URL or API_KEY is not set in environment variables"
    );
    return res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error: Missing API configuration",
      data: {},
    });
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(apiLink);
  } catch (error) {
    console.error("Invalid API link:", apiLink, error.message);
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Invalid API link",
      data: {},
    });
  }

  // Extract and set query parameters
  // const params = {
  //   organization_id: req.query.organization_id,
  //   start_date: req.query.start_date || "",
  //   end_date: req.query.end_date || "",
  //   limit: req.query.limit || 50,
  //   offset: req.query.offset || 0,
  // };

  const headers = {
    "X-Api-Key": apiKey,
    "Content-Type": "application/json",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
    Accept: "application/json",
    "Accept-Language": "en-US,en;q=0.9",
    Connection: "keep-alive",
  };

  try {
    console.log("Fetching data from API:", apiLink);
    const response = await axios.get(parsedUrl.origin + parsedUrl.pathname, {
      headers,
      // params,
    });
    const responseData = response.data;

    // Log the actual response to understand the structure
    console.log("API Response:", JSON.stringify(responseData, null, 2));

    // Validate the data before inserting into the database
    const data = responseData.data;
    if (!Array.isArray(data)) {
      console.error("API response is not an array:", data);
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Unexpected API response format",
        data: { apiData: responseData },
      });
    }

    const events = data.map((event) => ({
      name: event.name,
      eventId: event._id,
      slug: event.slug,
      description: event.description || "",
      display_date: new Date(event.display_date),
      start_date: new Date(event.start_date),
      end_date: new Date(event.end_date),
      code: event.code,
      age: event.age,
      image_url: event.image_url || "",
      outfit: event.outfit || "casual",
      ambiences: event.ambiences || [],
      music_genres: event.music_genres || [],
      artists: event.artists || [],
      organization_id: event.organization_id,
      // location_id: event.location_id,
      location: {
        // _id: event.location._id,
        address: event.location.address,
        city: event.location.city,
        country: event.location.country,
        full_address: event.location.full_address,
        latitude: event.location.latitude,
        longitude: event.location.longitude,
        timezone: event.location.timezone,
      },
      createdBy: req.user ? req.user._id : null,
    }));

    // Insert events into the database
    await Event.insertMany(events);

    res.status(200).json({
      status: 200,
      success: true,
      message: "Data fetched and saved successfully",
      data: responseData,
    });
  } catch (error) {
    console.error(
      "Error fetching data from API:",
      error.message,
      error.response?.data || ""
    );
    if (error.response && error.response.status === 401) {
      return res.status(401).json({
        status: 401,
        success: false,
        message:
          "Unauthorized: Check your API key or authentication credentials",
        data: {},
      });
    } else {
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Internal server error",
        data: {},
      });
    }
  }
};
