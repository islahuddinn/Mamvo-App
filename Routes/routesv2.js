const express = require("express");

const eventRoutesv2 = require('./eventRoutesv2')

const setupRoutesV2 = () => {
  const router = express.Router();
  
  router.use("/events", eventRoutesv2);
  

  
  return router;
};
module.exports = setupRoutesV2;
