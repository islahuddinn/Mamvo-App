const axios = require("axios");
const { URL } = require("url");
const Event = require("../Models/eventModel");
const EventTicketPrice = require("../Models/ticketsRateModel");
const mongoose = require("mongoose");
const Ticket = require("../Models/ticketModel");

exports.fetchDataFromAPI = async (req, res, next) => {
  console.log("END POINT HITTED for events");
  const apiLink = process.env.EVENT_API_BASE_URL;
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

exports.fetchEventTicketsRateFromAPI = async (req, res, next) => {
  console.log("END POINT HITTED for tickets Rates");
  const apiLink = process.env.TICKET_RATE_API_BASE_URL;
  const apiKey = process.env.API_KEY;

  // Log environment variables for debugging
  // console.log("API Base URL:", apiLink);
  // console.log("API Key:", apiKey);

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
  const params = { event_id: req.query.event_id };

  const headers = {
    "X-Api-Key": apiKey,
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0",
    Accept: "application/json",
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

    // Filter out eventTickets that are already in the database
    const existingEventIds = await EventTicketPrice.find({}).distinct(
      "event_id"
    );
    const newEventTicketPrices = data.filter(
      (ticket) => !existingEventIds.includes(ticket.event_id)
    );

    if (!newEventTicketPrices.length) {
      console.log("No new event tickets to insert.");
      return res.status(200).json({
        status: 200,
        success: true,
        message: "No new event tickets to insert",
        data: [],
      });
    }

    // Validate each ticket before inserting
    const validatedTickets = newEventTicketPrices.map((ticket) => ({
      _id: mongoose.isValidObjectId(ticket._id)
        ? ticket._id
        : new mongoose.Types.ObjectId(),
      organization_id: ticket.organization_id || "",
      event_id: ticket.event_id || "",
      name: ticket.name || "",
      slug: ticket.slug || "",
      valid_from: ticket.valid_from ? new Date(ticket.valid_from) : new Date(),
      complete: ticket.complete || false,
      type: ticket.type || "",
      show_all_prices: ticket.show_all_prices || false,
      prices: Array.isArray(ticket.prices)
        ? ticket.prices.map((price) => ({
            _id: mongoose.isValidObjectId(price._id)
              ? price._id
              : new mongoose.Types.ObjectId(),
            name: price.name || "",
            price: price.price || 0,
            valid_until: price.valid_until
              ? new Date(price.valid_until)
              : new Date(),
            quantity: price.quantity || 0,
            fee_type: price.fee_type || "",
            fee_quantity: price.fee_quantity || 0,
            includes: price.includes || "",
            additional_info: price.additional_info || "",
          }))
        : [],
      supplements: Array.isArray(ticket.supplements) ? ticket.supplements : [],
      available: ticket.available || false,
      current_price: ticket.current_price
        ? {
            _id: mongoose.isValidObjectId(ticket.current_price._id)
              ? ticket.current_price._id
              : new mongoose.Types.ObjectId(),
            name: ticket.current_price.name || "",
            price: ticket.current_price.price || 0,
            valid_until: ticket.current_price.valid_until
              ? new Date(ticket.current_price.valid_until)
              : new Date(),
            quantity: ticket.current_price.quantity || 0,
            fee_type: ticket.current_price.fee_type || "",
            fee_quantity: ticket.current_price.fee_quantity || 0,
            includes: ticket.current_price.includes || "",
            additional_info: ticket.current_price.additional_info || "",
          }
        : null,
      warranty: {
        enabled: ticket.warranty?.enabled || false,
        hours: ticket.warranty?.hours || 0, // Default value for hours
        percentage: ticket.warranty?.percentage || 0, // Default value for percentage
      },
      availability: ticket.availability || { sold: 0, available: 0 },
      min: ticket.min || 1,
      max: ticket.max || 1,
      questions: Array.isArray(ticket.questions) ? ticket.questions : [],
    }));

    // Log validated tickets before insertion
    console.log(
      "Validated Tickets:",
      JSON.stringify(validatedTickets, null, 2)
    );

    // Insert event ticket prices into the database
    await EventTicketPrice.insertMany(validatedTickets);

    res.status(200).json({
      status: 200,
      success: true,
      message: "Data fetched and saved successfully",
      data: validatedTickets,
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

///////fetching data from apis for tickets

exports.fetchTicketsDataFromAPI = async (req, res, next) => {
  console.log("END POINT HITTED for events");
  const apiLink = process.env.PURCHASE_TICKET_API_BASE_URL;
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

  // Ensure both event_id and ticket_rate_id are present in the query parameters
  const { tarifa_id, cantidat } = req.query;

  if (!event_id && !ticket_rate_id) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Missing required query parameters: event_id or ticket_rate_id",
      data: {},
    });
  }

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
    const fetchTickets = async (params) => {
      const response = await axios.get(parsedUrl.origin + parsedUrl.pathname, {
        headers,
        params,
      });
      return response.data.data;
    };
    console.log(fetchTickets, "book event api data");
    // let ticketsData = [];

    // if (event_id) {
    //   console.log("Fetching data for event_id:", event_id);
    //   const eventTickets = await fetchTickets({ event_id });
    //   ticketsData = ticketsData.concat(eventTickets);
    // }

    // if (ticket_rate_id) {
    //   console.log("Fetching data for ticket_rate_id:", ticket_rate_id);
    //   const rateTickets = await fetchTickets({ ticket_rate_id });
    //   ticketsData = ticketsData.concat(rateTickets);
    // }

    // Log the actual response to understand the structure
    console.log("API Response:", JSON.stringify(ticketsData, null, 2));

    // Validate the data before inserting into the database
    if (!Array.isArray(ticketsData)) {
      console.error("API response is not an array:", ticketsData);
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Unexpected API response format",
        data: { apiData: ticketsData },
      });
    }

    // Fetch existing tickets from the database
    const existingTickets = await Ticket.find({}, "event_id ticket_rate_id");
    const existingTicketIdentifiers = new Set(
      existingTickets.map(
        (ticket) => `${ticket.event_id}-${ticket.ticket_rate_id}`
      )
    );

    // Filter out tickets that are already in the database
    const newTickets = ticketsData.filter(
      (ticket) =>
        !existingTicketIdentifiers.has(
          `${ticket.event_id}-${ticket.ticket_rate_id}`
        )
    );

    const tickets = newTickets.map((ticket) => ({
      event_id: ticket.event_id,
      ticket_rate_id: ticket.ticket_rate_id,
      qr_code: ticket.qr_code,
      status: ticket.status,
      price: {
        _id: ticket.price._id,
        name: ticket.price.name,
        price: ticket.price.price,
        valid_until: new Date(ticket.price.valid_until),
        quantity: ticket.price.quantity,
        fee_type: ticket.price.fee_type,
        fee_quantity: ticket.price.fee_quantity,
        includes: ticket.price.includes,
        additional_info: ticket.price.additional_info,
      },
      channel_id: ticket.channel_id,
      fees: {
        organization: ticket.fees.organization,
        discocil: ticket.fees.discocil,
      },
      full_name: ticket.full_name,
      phone: ticket.phone,
      email: ticket.email,
      gender: ticket.gender,
      birthday: new Date(ticket.birthday),
      address: ticket.address,
      postal_code: ticket.postal_code,
      country_code: ticket.country_code,
      personal_document_type: ticket.personal_document_type,
      personal_document_number: ticket.personal_document_number,
      answers: ticket.answers.map((answer) => ({
        question_id: answer.question_id,
        answer: answer.answer,
      })),
      supplements: ticket.supplements.map((supplement) => ({
        supplement_id: supplement.supplement_id,
        price: supplement.price,
      })),
      refunded: ticket.refunded,
      refunded_at: ticket.refunded_at ? new Date(ticket.refunded_at) : null,
      refunds: ticket.refunds.map((refund) => ({
        channel_id: refund.channel_id,
        amount: refund.amount,
        at: new Date(refund.at),
      })),
      for: ticket.for,
      enter: ticket.enter,
      entry_time: ticket.entry_time ? new Date(ticket.entry_time) : null,
      total_supplements: ticket.total_supplements,
      total_fees: ticket.total_fees,
      total_price: ticket.total_price,
      warranty: {
        total: ticket.warranty.total,
        hours: ticket.warranty.hours,
      },
    }));

    // Insert tickets into the database
    await Ticket.insertMany(tickets);

    res.status(200).json({
      status: 200,
      success: true,
      message: "Data fetched and saved successfully",
      data: ticketsData,
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
    } else if (error.response && error.response.status === 400) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Bad request: Check your query parameters",
        data: error.response.data,
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

///// Fetching data for buying tickets

exports.fetchPriceDataFromAPI = async (req, res, next) => {
  console.log("END POINT HITTED for buying tickets");
  const apiLink = process.env.PURCHASE_TICKET_API_BASE_URL;
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
    tarifa_id: req.query.List_id || "",
    cantidad: req.query.cantidad || "",
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

    // Continue with your existing logic to process and save data
    // ...
  } catch (error) {
    console.error(
      "Error fetching data from API:",
      error.message,
      error.response?.data || ""
    );

    if (error.response) {
      // Log full error response for debugging
      console.error("Full error response:", error.response.data);

      if (error.response.status === 401) {
        return res.status(401).json({
          status: 401,
          success: false,
          message:
            "Unauthorized: Check your API key or authentication credentials",
          data: {},
        });
      } else if (error.response.status === 403) {
        return res.status(403).json({
          status: 403,
          success: false,
          message: "Forbidden: Ensure auth data is correct and you have access",
          data: error.response.data,
        });
      } else if (
        error.response.status === 400 &&
        error.response.data === "Invalid token"
      ) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Invalid token: Ensure your API key is correct",
          data: error.response.data,
        });
      } else {
        return res.status(500).json({
          status: 500,
          success: false,
          message: "Internal server error",
          data: {},
        });
      }
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
