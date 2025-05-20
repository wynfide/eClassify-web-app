importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');
// // Initialize the Firebase app in the service worker by passing the generated config

const firebaseConfig = {
  apiKey: "AIzaSyDlDbHKV1D-xkOaOs_vbAcGHPieAiCRrqI",
  authDomain: "wynfi-app.firebaseapp.com",
  projectId: "wynfi-app",
  storageBucket: "wynfi-app.firebasestorage.app",
  messagingSenderId: "295719356251",
  appId: "1:295719356251:web:b6fc63091ec8c146903c7e",
  measurementId: "G-XQG6MKDPRS"
};



firebase?.initializeApp(firebaseConfig)

// Retrieve firebase messaging
const messaging = firebase.messaging();

self.addEventListener('install', function (event) {
    console.log('Hello world from the Service Worker :call_me_hand:');
});
