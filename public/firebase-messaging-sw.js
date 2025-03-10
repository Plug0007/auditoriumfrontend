// frontend/public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/8.6.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyBD08QEXt3SeFIeLCYtGeN-9JcDHAYmO4w",
  authDomain: "audi-689cd.firebaseapp.com",
  projectId: "audi-689cd",
  storageBucket: "audi-689cd.firebasestorage.app",
  messagingSenderId: "193853064733",
  appId: "1:193853064733:web:2c3843f0022214e335e8f4"
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  const title = 'Background Notification';
  const options = {
    body: payload.data.body,
    icon: '/icons/icon-192x192.png'
  };
  return self.registration.showNotification(title, options);
});
