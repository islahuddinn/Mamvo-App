const firebaseAdmin = require('./FirebaseInitialization')

exports.sendNotification = async ({fcmToken, title, body,notificationData}) => {
    try {
     const response = await firebaseAdmin.messaging().send({
          token: fcmToken,
          notification: {
              title,
              body,
          },
          data: {notificationData}
      });
  
      console.log("NOTIFICATION SENT!!!", response)
    } catch (err) {
      console.log("NOTIFICATION FAILED TO SEND", err)
      
    }

  };


  exports.sendMulticastNotification = async ({ fcmTokens, title, body, notificationData }) => {
    try {
      const message = {
        notification: {
          title,
          body,
        },
        tokens: fcmTokens,
        data: {notificationData},
      };
  
      const response = await firebaseAdmin.messaging().sendMulticast(message);
      console.log('Multicast notification sent:', response.successCount, 'successes');
      console.log("RESPONSE FOR MULTICAST NOTIFICATION IS:", response)

    } catch (err) {
      console.error('Error sending multicast notification:', err);
    }
  };
  