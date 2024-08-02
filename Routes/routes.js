const express = require("express");
const userRoutes = require("./userRoute");
const eventRoutes = require("./eventRoutes");
const privacyRoutes = require("./privacyPolicyRoute");
const termsandconditionRoutes = require("./termsAndConditionRoute");
const subscriptionRoutes = require("./subscriptionRoutes");
const organizationRoutes = require('./organizationRoutes')
const ticketRateRoutes = require('./ticketRateRoutes')


const setupRoutesV1 = () => {
  const router = express.Router();
  router.use("/user", userRoutes);
  router.use("/events", eventRoutes);
  router.use("/privacy", privacyRoutes);
  router.use("/termsandcondition", termsandconditionRoutes);
  router.use("/subscription", subscriptionRoutes);
  router.use('/organizations', organizationRoutes)
  router.use('/ticket-rates', ticketRateRoutes)

  return router;
};
module.exports = setupRoutesV1;
