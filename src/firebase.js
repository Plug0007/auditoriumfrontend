// frontend/src/firebase.js
import firebase from 'firebase/app';
import 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env."AIzaSyBD08QEXt3SeFIeLCYtGeN-9JcDHAYmO4w", 
  authDomain: process.env."audi-689cd.firebaseapp.com",
  projectId: process.env."audi-689cd",
  storageBucket: process.env."audi-689cd.firebasestorage.app",
  messagingSenderId: process.env."193853064733",
  appId: process.env."1:193853064733:web:2c3843f0022214e335e8f4",
  measurementId: process.env."G-NW7F7JSKRJ"

};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

export { messaging, firebase as default };
