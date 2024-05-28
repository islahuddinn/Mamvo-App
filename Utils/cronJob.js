const cron = require("node-cron");
const Event = require("../Models/eventModel");
const Notification = require("../Models/notificationModel");
const {
  sendPushNotification,
} = require("../Controllers/pushNotificationController");
const {
  fetchDataFromAPI,
  fetchEventTicketsFromAPI,
} = require("../Controllers/apiController");

// const { sendPushNotification } = require("./Utils/pushNotification");
const User = require("../Models/userModel");

cron.schedule("* * * * *", async () => {
  console.log("PUSH NOTIFICATION AND API CRON JOB IS ACTIVE");
  await fetchDataFromAPI();
  await fetchEventTicketsFromAPI();
  try {
    // Fetch new events that have not been notified
    const newEvents = await Event.find({ notified: false });

    if (newEvents.length > 0) {
      // Fetch all user FCM tokens
      const users = await User.find({}, "deviceToken");
      const fcmTokens = users.map((user) => user.deviceToken);

      if (fcmTokens.length > 0) {
        for (const event of newEvents) {
          const title = `New Event: ${event.name}`;
          const body = `Check out the new event happening at ${event.location.city}!`;

          // Send push notification
          await sendPushNotification(title, body, fcmTokens);

          // Update the event to mark it as notified
          event.notified = true;
          await event.save();
          await Notification.create({
            title: title,
            sender: req.user._id,
            reciever: users,
            data: newEvents,
          });
        }
      } else {
        console.log("No FCM tokens found.");
      }
    } else {
      console.log("No new events to notify.");
    }
  } catch (error) {
    console.error("Error in CRON job:", error);
  }
});
