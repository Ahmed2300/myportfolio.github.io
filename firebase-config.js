// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBsB1j1Cc829uJwq9R8qpZ5kMNS3C2qp3w",
  authDomain: "wechat-9694d.firebaseapp.com",
  databaseURL: "https://wechat-9694d-default-rtdb.firebaseio.com",
  projectId: "wechat-9694d",
  storageBucket: "wechat-9694d.appspot.com",
  messagingSenderId: "679037804410",
  appId: "1:679037804410:web:776f0cab1de4b5e8cec0c3",
  measurementId: "G-Z9LDZNHG9C"
};

// Initialize Firebase
if (typeof firebase !== 'undefined') {
  // Check if Firebase is already initialized
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully in firebase-config.js");
  } else {
    console.log("Firebase already initialized");
  }
} else {
  console.error("Firebase SDK not found. Make sure you have included the Firebase scripts.");
}
