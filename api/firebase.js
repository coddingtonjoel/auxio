// Import the functions you need from the SDKs you need
const {initializeApp} = require("firebase/app");
const {getAuth} = require("firebase/auth");
//const { getAnalytics } = require("firebase/analytics");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCfjtyToI-PljpBTlvpUMq-HW9UZ5pR-As",
  authDomain: "auxio-26c70.firebaseapp.com",
  projectId: "auxio-26c70",
  storageBucket: "auxio-26c70.appspot.com",
  messagingSenderId: "902655600558",
  appId: "1:902655600558:web:e1278fec2dad1a1765ca3f",
  measurementId: "G-M2Y1KTGR5J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const authentification = getAuth(app);
//const analytics = getAnalytics(app);

module.exports = {
  app,
  authentification
}