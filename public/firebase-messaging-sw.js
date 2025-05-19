importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');
// // Initialize the Firebase app in the service worker by passing the generated config

const firebaseConfig = {
  apiKey: "AIzaSyB4QfubBZpoQlX5RRkDiHQiwUhar0hqfKU",
  authDomain: "eclassify-84e25.firebaseapp.com",
  projectId: "eclassify-84e25",
  storageBucket: "eclassify-84e25.firebasestorage.app",
  messagingSenderId: "118133670765",
  appId: "1:118133670765:web:463c43352bead0abd01064",
  measurementId: "G-B5PY2E597D"
};


firebase?.initializeApp(firebaseConfig)

// Retrieve firebase messaging
const messaging = firebase.messaging();

self.addEventListener('install', function (event) {
    console.log('Hello world from the Service Worker :call_me_hand:');
});
