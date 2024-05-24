const axios = require("axios");
const { URL } = require("url");
const Event = require("../Models/eventModel");
const EventTicketPrice = require("../Models/ticketsModel");

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
    // return res.status(500).json({
    //   status: 500,
    //   success: false,
    //   message: "Internal server error: Missing API configuration",
    //   data: {},
    // });
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(apiLink);
  } catch (error) {
    console.error("Invalid API link:", apiLink, error.message);
    // return res.status(400).json({
    //   status: 400,
    //   success: false,
    //   message: "Invalid API link",
    //   data: {},
    // });
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
    console.log("badoo badee", responseData);

    // Log the actual response to understand the structure
    console.log("API Response:", JSON.stringify(responseData, null, 2));

    // Validate the data before inserting into the database
    const data = responseData.data;
    if (!Array.isArray(data)) {
      console.error("API response is not an array:", data);
      // return res.status(500).json({
      //   status: 500,
      //   success: false,
      //   message: "Unexpected API response format",
      //   data: { apiData: responseData },
      // });
    }
    const existingEvents = await Event.find({}, "eventId");
    const existingEventIds = existingEvents.map((event) => event.eventId);

    // Filter out events that are already in the database
    const newEvents = data.filter(
      (event) => !existingEventIds.includes(event._id)
    );

    const events = newEvents.map((event) => ({
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
      notified,
      // createdBy: req.user ? req.user._id : null,
    }));

    // Insert events into the database
    await Event.insertMany(events);

    // res.status(200).json({
    //   status: 200,
    //   success: true,
    //   message: "Data fetched and saved successfully",
    //   data: responseData,
    // });
  } catch (error) {
    console.error(
      "Error fetching data from API:",
      error.message,
      error.response?.data || ""
    );
    // if (error.response && error.response.status === 401) {
    //   return res.status(401).json({
    //     status: 401,
    //     success: false,
    //     message:
    //       "Unauthorized: Check your API key or authentication credentials",
    //     data: {},
    //   });
    // } else {
    //   return res.status(500).json({
    //     status: 500,
    //     success: false,
    //     message: "Internal server error",
    //     data: {},
    //   });
    // }
  }
};

// exports.fetchEventTicketsFromAPI = async (req, res, next) => {
//   console.log("END POINT HITTED");
//   const apiLink = process.env.API_BASE_URL;
//   const apiKey = process.env.API_KEY;

//   // Log environment variables for debugging
//   console.log("API Base URL:", apiLink);
//   console.log("API Key:", apiKey);

//   // Check if environment variables are properly set
//   if (!apiLink || !apiKey) {
//     console.error(
//       "API_BASE_URL or API_KEY is not set in environment variables"
//     );
//     return res.status(500).json({
//       status: 500,
//       success: false,
//       message: "Internal server error: Missing API configuration",
//       data: {},
//     });
//   }

//   let parsedUrl;
//   try {
//     parsedUrl = new URL(apiLink);
//   } catch (error) {
//     console.error("Invalid API link:", apiLink, error.message);
//     return res.status(400).json({
//       status: 400,
//       success: false,
//       message: "Invalid API link",
//       data: {},
//     });
//   }

//   // Extract and set query parameters
//   const params = {
//     event_id: req.query.event_id,
//   };

//   const headers = {
//     "X-Api-Key": apiKey,
//     "Content-Type": "application/json",
//     "User-Agent":
//       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
//     Accept: "application/json",
//     "Accept-Language": "en-US,en;q=0.9",
//     Connection: "keep-alive",
//   };

//   try {
//     console.log("Fetching data from API:", apiLink);
//     const response = await axios.get(parsedUrl.origin + parsedUrl.pathname, {
//       headers,
//       params,
//     });
//     const responseData = response.data;
//     console.log("API Response:", JSON.stringify(responseData, null, 2));

//     // Validate the data before inserting into the database
//     const data = responseData.data;
//     if (!Array.isArray(data)) {
//       console.error("API response is not an array:", data);
//       return res.status(500).json({
//         status: 500,
//         success: false,
//         message: "Unexpected API response format",
//         data: { apiData: responseData },
//       });
//     }

//     const eventTicketPrices = data.map((ticket) => ({
//       event_id: ticket.event_id,
//       organization_id: ticket.organization_id,
//       name: ticket.name,
//       slug: ticket.slug,
//       valid_from: new Date(ticket.valid_from),
//       complete: ticket.complete,
//       type: ticket.type,
//       show_all_prices: ticket.show_all_prices,
//       prices: ticket.prices.map((price) => ({
//         _id: price._id,
//         name: price.name,
//         price: price.price,
//         valid_until: new Date(price.valid_until),
//         quantity: price.quantity,
//         fee_type: price.fee_type,
//         fee_quantity: price.fee_quantity,
//         includes: price.includes,
//         additional_info: price.additional_info,
//       })),
//       supplements: ticket.supplements.map((supplement) => ({
//         _id: supplement._id,
//         label: supplement.label,
//         price: supplement.price,
//       })),
//       available: ticket.available,
//       current_price: {
//         _id: ticket.current_price._id,
//         name: ticket.current_price.name,
//         price: ticket.current_price.price,
//         valid_until: new Date(ticket.current_price.valid_until),
//         quantity: ticket.current_price.quantity,
//         fee_type: ticket.current_price.fee_type,
//         fee_quantity: ticket.current_price.fee_quantity,
//         includes: ticket.current_price.includes,
//         additional_info: ticket.current_price.additional_info,
//       },
//       warranty: {
//         enabled: ticket.warranty.enabled,
//         percentage: ticket.warranty.percentage,
//         hours: ticket.warranty.hours,
//       },
//       availability: {
//         sold: ticket.availability.sold,
//         available: ticket.availability.available,
//       },
//       min: ticket.min,
//       max: ticket.max,
//       questions: ticket.questions.map((question) => ({
//         _id: question._id,
//         label: question.label,
//         type: question.type,
//         required: question.required,
//         items: question.items,
//       })),
//     }));

//     // Insert event ticket prices into the database
//     await EventTicketPrice.insertMany(eventTicketPrices);

//     res.status(200).json({
//       status: 200,
//       success: true,
//       message: "Data fetched and saved successfully",
//       data: responseData,
//     });
//   } catch (error) {
//     console.error(
//       "Error fetching data from API:",
//       error.message,
//       error.response?.data || ""
//     );
//     if (error.response && error.response.status === 401) {
//       return res.status(401).json({
//         status: 401,
//         success: false,
//         message:
//           "Unauthorized: Check your API key or authentication credentials",
//         data: {},
//       });
//     } else {
//       return res.status(500).json({
//         status: 500,
//         success: false,
//         message: "Internal server error",
//         data: {},
//       });
//     }
//   }
// };

exports.fetchEventTicketsFromAPI = async (req, res, next) => {
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
  const params = {
    event_id: req.query.event_id,
  };

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
      params,
    });
    const responseData = response.data;
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
    console.log(data, "data g");
    console.log(responseData, "data g in responseData format");

    // // Filter out events that are already in the database
    // const existingEventIds = await EventTicketPrice.find(
    //   {},
    //   "event_id"
    // ).distinct("event_id");
    // const newEventTicketPrices = data.filter(
    //   (ticket) => !existingEventIds.includes(ticket.event_id)
    // );

    // if (!newEventTicketPrices.length) {
    //   console.log("No new event tickets to insert.");
    //   return res.status(200).json({
    //     status: 200,
    //     success: true,
    //     message: "No new event tickets to insert",
    //     data: [],
    //   });
    // }

    // // Validate each ticket before inserting
    // const validatedTickets = newEventTicketPrices.map((ticket) => {
    //   return {
    //     _id: ticket._id || new mongoose.Types.ObjectId(),
    //     organization_id: ticket.organization_id || "",
    //     event_id: ticket.event_id || "",
    //     name: ticket.name || "",
    //     slug: ticket.slug || "",
    //     valid_from: ticket.valid_from
    //       ? new Date(ticket.valid_from)
    //       : new Date(),
    //     complete: ticket.complete || false,
    //     type: ticket.type || "",
    //     show_all_prices: ticket.show_all_prices || false,
    //     prices: Array.isArray(ticket.prices)
    //       ? ticket.prices.map((price) => ({
    //           _id: price._id || new mongoose.Types.ObjectId(),
    //           name: price.name || "",
    //           price: price.price || 0,
    //           valid_until: price.valid_until
    //             ? new Date(price.valid_until)
    //             : new Date(),
    //           quantity: price.quantity || 0,
    //           fee_type: price.fee_type || "",
    //           fee_quantity: price.fee_quantity || 0,
    //           includes: price.includes || "",
    //           additional_info: price.additional_info || "",
    //         }))
    //       : [],
    //     supplements: Array.isArray(ticket.supplements)
    //       ? ticket.supplements
    //       : [],
    //     available: ticket.available || false,
    //     current_price: ticket.current_price
    //       ? {
    //           _id: ticket.current_price._id || new mongoose.Types.ObjectId(),
    //           name: ticket.current_price.name || "",
    //           price: ticket.current_price.price || 0,
    //           valid_until: ticket.current_price.valid_until
    //             ? new Date(ticket.current_price.valid_until)
    //             : new Date(),
    //           quantity: ticket.current_price.quantity || 0,
    //           fee_type: ticket.current_price.fee_type || "",
    //           fee_quantity: ticket.current_price.fee_quantity || 0,
    //           includes: ticket.current_price.includes || "",
    //           additional_info: ticket.current_price.additional_info || "",
    //         }
    //       : null,
    //     warranty: ticket.warranty || { enabled: false },
    //     availability: ticket.availability || { sold: 0, available: 0 },
    //     min: ticket.min || 1,
    //     max: ticket.max || 1,
    //     questions: Array.isArray(ticket.questions) ? ticket.questions : [],
    //   };
    // });

    // Insert event ticket prices into the database
    // await EventTicketPrice.insertMany(data);

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
