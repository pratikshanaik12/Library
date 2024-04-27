// Import the functions you need from the SDKs you need
// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdqOBmN8JBThgI95uHcGmOnvwNzS58BcY",
  authDomain: "library-6aa73.firebaseapp.com",
  projectId: "library-6aa73",
  storageBucket: "library-6aa73.appspot.com",
  messagingSenderId: "240437212180",
  appId: "1:240437212180:web:338b7b204147c5af036301",
  measurementId: "G-C0GBEQ07ST"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


module.exports = firebaseConfig;