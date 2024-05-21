// const axios = require("axios");
// const { URL } = require("url");

// exports.fetchDataFromAPI = async (req, res, next) => {
//   const  apiLink  = process.env.Api_Base_Url;

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

//   // Extract query parameters from the URL
//   const params = {
//     organization_id: parsedUrl.searchParams.get("organization_id"),
//     start_date: parsedUrl.searchParams.get("start_date"),
//     end_date: parsedUrl.searchParams.get("end_date"),
//     limit: parsedUrl.searchParams.get("limit"),
//     offset: parsedUrl.searchParams.get("offset"),
//   };

//   // Validate required parameters
//   if (
//     !params.start_date ||
//     !params.end_date ||
//     !params.limit ||
//     !params.offset
//   ) {
//     return res.status(400).json({
//       status: 400,
//       success: false,
//       message: `Missing required query parameter "${params}"`,
//       data: {},
//     });
//   }

//   const headers = {
//     "X-Api-Key": process.env.API_KEY, // Replace with your actual API key
//     "Content-Type": "application/json",
//     "User-Agent":
//       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
//     Accept: "application/json",
//     "Accept-Language": "en-US,en;q=0.9",
//     Connection: "keep-alive",
//   };

//   // Make an HTTP request to fetch data from the API
//   try {
//     console.log("Fetching data from API:", apiLink);
//     const response = await axios.get(parsedUrl.origin + parsedUrl.pathname, {
//       headers,
//       params,
//     });
//     const data = response.data;
//     console.log("Data fetched successfully:", data);
//     res.status(200).json({
//       status: 200,
//       success: true,
//       message: "Data fetched successfully",
//       data: { apiData: data },
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

const axios = require("axios");
const { URL } = require("url");
const Event = require("../Models/eventModel");

exports.fetchDataFromAPI = async (req, res, next) => {
  const apiLink = process.env.API_BASE_URL;

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

  // Extract query parameters from the request query
  const params = {
    organization_id: req.query.organization_id || null,
    start_date: req.query.start_date || null,
    end_date: req.query.end_date || null,
    limit: req.query.limit || null,
    offset: req.query.offset || null,
  };

  // No need to validate query parameters as they are optional

  const headers = {
    "X-Api-Key": process.env.API_KEY,
    "Content-Type": "application/json",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
    Accept: "application/json",
    "Accept-Language": "en-US,en;q=0.9",
    Connection: "keep-alive",
  };

  // Make an HTTP request to fetch data from the API
  try {
    console.log("Fetching data from API:", apiLink);
    const response = await axios.get(parsedUrl.origin + parsedUrl.pathname, {
      headers,
      params,
    });
    const data = response.data;

    console.log("Data fetched successfully:", data);

    // Insert fetched data into the database
    await Event.insertMany(data);

    res.status(200).json({
      status: 200,
      success: true,
      message: "Data fetched and stored successfully",
      data: { apiData: data },
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
