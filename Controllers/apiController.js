// const axios = require("axios");
// const { URL } = require("url");
// const HttpsProxyAgent = require("https-proxy-agent");

// exports.fetchDataFromAPI = async (req, res, next) => {
//   const { apiLink } = req.body;

//   // Validate if the provided API link is a valid URL
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
//       message: "Missing required query parameters",
//       data: {},
//     });
//   }

//   const headers = {
//     "X-Api-Key":
//       "sk_test_2jRIs1i0WWS6WwqCSgGe66oQEQUSmU06I2q06I6SsWkMYGOs2skKUIMusG2uUYwgasYSIKUCkKM2WmqC2COKsesYWeoKYCESWYkG", // Replace with your actual API key
//     "Content-Type": "application/json",
//     "User-Agent":
//       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
//     Accept: "application/json",
//     "Accept-Language": "en-US,en;q=0.9",
//     Connection: "keep-alive",
//   };

//   const proxy = "http://your-proxy-server:port"; // Replace with your proxy server if needed
//   const agent = new HttpsProxyAgent(proxy);

//   // Make an HTTP request to fetch data from the API
//   try {
//     console.log("Fetching data from API:", apiLink);
//     const response = await axios.get(parsedUrl.origin + parsedUrl.pathname, {
//       headers,
//       params,
//       httpsAgent: agent,
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

exports.fetchDataFromAPI = async (req, res, next) => {
  const { apiLink } = req.body;

  // Validate if the provided API link is a valid URL
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

  // Extract query parameters from the URL
  const params = {
    organization_id: parsedUrl.searchParams.get("organization_id"),
    start_date: parsedUrl.searchParams.get("start_date"),
    end_date: parsedUrl.searchParams.get("end_date"),
    limit: parsedUrl.searchParams.get("limit"),
    offset: parsedUrl.searchParams.get("offset"),
  };

  // Validate required parameters
  if (
    !params.start_date ||
    !params.end_date ||
    !params.limit ||
    !params.offset
  ) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Missing required query parameters",
      data: {},
    });
  }

  const headers = {
    "X-Api-Key":
      "sk_test_2jRIs1i0WWS6WwqCSgGe66oQEQUSmU06I2q06I6SsWkMYGOs2skKUIMusG2uUYwgasYSIKUCkKM2WmqC2COKsesYWeoKYCESWYkG", // Replace with your actual API key
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
    res.status(200).json({
      status: 200,
      success: true,
      message: "Data fetched successfully",
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
