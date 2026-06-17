importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAdus_PvtnQ-BOZWw7qqsj6JeDpqgBkYjY",
  authDomain: "adhvaithafoods-7a9a8.firebaseapp.com",
  projectId: "adhvaithafoods-7a9a8",
  storageBucket: "adhvaithafoods-7a9a8.firebasestorage.app",
  messagingSenderId: "431170665251",
  appId: "1:431170665251:web:be21e2c48fc02641336a96",
  measurementId: "G-RCQYKLYTPH"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico',
    image: payload.notification.image || payload.notification.imageUrl
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
