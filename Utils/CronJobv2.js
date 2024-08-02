const cron = require("node-cron");
const { fetchAndStoreEvents, fetchAndStoreOrganizations } = require('../Helpers/CronHelpers')


module.exports = () => {
  cron.schedule("* * * * *", async () => {
    console.log("CRON JOB STARTED!!!");
    fetchAndStoreOrganizations()
    fetchAndStoreEvents()

  });
};
