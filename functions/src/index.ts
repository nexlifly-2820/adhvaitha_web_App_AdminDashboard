import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Allows CORS for cross-origin requests
const cors = require('cors')({ origin: true });

export const sendMarketingNotification = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    try {
      const { data } = request.body;
      if (!data || !data.title || !data.body) {
        response.status(400).send({ error: { message: "Title and body are required." } });
        return;
      }

      const message: any = {
        notification: {
          title: data.title,
          body: data.body,
        },
        data: {},
        android: {
          notification: {}
        },
        apns: {
          payload: {
            aps: {
              'mutable-content': 1
            }
          },
          fcm_options: {}
        },
        topic: 'marketing'
      };

      if (data.imageUrl) {
        message.notification.imageUrl = data.imageUrl;
        message.data.imageUrl = data.imageUrl;
        message.data.image = data.imageUrl;
        message.android.notification.imageUrl = data.imageUrl;
        message.apns.fcm_options.image = data.imageUrl;
      }

      const messageId = await admin.messaging().send(message);
      
      response.status(200).send({ data: { success: true, messageId } });
    } catch (error) {
      console.error('Error sending marketing notification:', error);
      response.status(500).send({ error: { message: "Internal server error" } });
    }
  });
});

export const sendCustomNotification = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    try {
      const { data } = request.body;
      if (!data || !data.userId || !data.title || !data.body) {
        response.status(400).send({ error: { message: "UserId, title, and body are required." } });
        return;
      }

      // To send to a specific user, you generally send to a topic named after their userId
      // Or you look up their FCM token from Firestore. For simplicity, we'll use a topic.
      const message: any = {
        notification: {
          title: data.title,
          body: data.body,
        },
        topic: `user_${data.userId}`
      };

      if (data.imageUrl) {
        message.notification.imageUrl = data.imageUrl;
      }

      const messageId = await admin.messaging().send(message);
      
      response.status(200).send({ data: { success: true, messageId } });
    } catch (error) {
      console.error('Error sending custom notification:', error);
      response.status(500).send({ error: { message: "Internal server error" } });
    }
  });
});

export const subscribeToTopic = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    try {
      const { data } = request.body;
      if (!data || !data.token || !data.topic) {
        response.status(400).send({ error: { message: "Token and topic are required." } });
        return;
      }

      await admin.messaging().subscribeToTopic(data.token, data.topic);
      response.status(200).send({ data: { success: true } });
    } catch (error) {
      console.error('Error subscribing to topic:', error);
      response.status(500).send({ error: { message: "Internal server error" } });
    }
  });
});
