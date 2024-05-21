const axios = require("axios");

const appId = "xxx_APP_ID_xxx";
const secretKey = "xxx_SECRET_KEY_xxx";
const urlProduccion = "https://api.fourvenues.com/connector/auth/access_token";
const urlDesarrollo =
  "https://alpha.api.fourvenues.com/connector/auth/access_token";

const getUrl = (appId, secretKey) =>
  `${urlProduccion}?app_id=${appId}&secret=${secretKey}`;

axios
  .get(getUrl(appId, secretKey))
  .then((response) => {
    const accessToken = response.data.data.token;
    console.log(accessToken);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });
