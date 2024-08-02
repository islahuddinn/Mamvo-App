const cron = require("node-cron");
const { fetchAndStoreEvents } = require('../Helpers/CronHelpers')


module.exports = () => {
  cron.schedule("* * * * *", async () => {
    console.log("CRON JOB STARTED!!!");
    fetchAndStoreEvents()
  });
};
