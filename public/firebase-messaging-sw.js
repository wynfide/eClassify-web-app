importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');
// // Initialize the Firebase app in the service worker by passing the generated config

const firebaseConfig = {
  apiKey: "AIzaSyDF4akNXoNOFjedcwmYomSjnYTOGjn0USI",
  authDomain: "eclassify-57e13.firebaseapp.com",
  projectId: "eclassify-57e13",
  storageBucket: "eclassify-57e13.firebasestorage.app",
  messagingSenderId: "65833947255",
  appId: "1:65833947255:web:495d09eef5d74c5b237672",
  measurementId: "G-NG8BG0CQTF"
};

firebase?.initializeApp(firebaseConfig)

// Retrieve firebase messaging
const messaging = firebase.messaging();

self.addEventListener('install', function (event) {
    console.log('Hello world from the Service Worker :call_me_hand:');
});
