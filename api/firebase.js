// Import the functions you need from the SDKs you need
const { request } = require("express");
const {initializeApp} = require("firebase/app");
const {getAuth, signInWithCredential, GoogleAuthProvider} = require("firebase/auth");
const {getDatabase, ref, set, onValue, get, off} = require("firebase/database");
const { WatchIgnorePlugin } = require("webpack");
const {GoogleCred} = require("./google.js");
//const { getAnalytics } = require("firebase/analytics");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// Initialize Firebase

const firebaseConfig = {
  apiKey: "AIzaSyCfjtyToI-PljpBTlvpUMq-HW9UZ5pR-As",
  authDomain: "auxio-26c70.firebaseapp.com",
  databaseURL: "https://auxio-26c70-default-rtdb.firebaseio.com",
  projectId: "auxio-26c70",
  storageBucket: "auxio-26c70.appspot.com",
  messagingSenderId: "902655600558",
  appId: "1:902655600558:web:e1278fec2dad1a1765ca3f",
  measurementId: "G-M2Y1KTGR5J"
};

class Database
{

  static app = null;
  static authentification = null;
  static userCredentials = null; //note .accessToken member
  static db = null; //the real time firebase database object

  static initServer()
  {
    Database.app = initializeApp(firebaseConfig);
    Database.authentification = getAuth(Database.app);
    Database.db = getDatabase(Database.app);

    if(Database.userCredentials == null) //only sign in if the credentials aren't set
      this.requestCredentials(); //get credentials

    //get creds in desired format
    let googleCred = GoogleAuthProvider.credential(Database.userCredentials.tokenId, Database.userCredentials.accessToken);

    //sign in and authenticate
    signInWithCredential(Database.authentification, googleCred)
      .then((e) => {console.log("Firebase Authentification Success")})
      .catch((error) => {
      console.log("Authentification failed!");
      console.log(error.code);
      console.log(error.message);
    });
  }

  static requestCredentials = () => {
    Database.userCredentials = GoogleCred.getCredentials();
    //console.log(Database.userCredentials.accessToken);
  }

  //location and listener function needed, see AppMenu.js for example. listener function is called once the data is retrieved and whenever the data field is changed on the server.
  static getData = (location, listenFunc) => {
    onValue(ref(Database.db, location), listenFunc);
    return -1;
  }

  //get data via a promise
  static getDataOnce = (location, listenFunc) => {
    return get(ref(Database.db, location));
  }

  //set, location, and data needed, see AppMenu.js for usage example
  static createData = (location, data) => {
    //console.log(data);
    set(ref(Database.db, location), data);
  }

  //actually just a set data to null in the given location, this will remove the piece of data (and label).
  static deleteData = (location) => {
    return set(ref(Database.db, location), null);
  }

  //remove a specified listener from a location
  static removeListener = (location, listener) => {
    off(ref(Database.db, location), listener);
  }

  //remove all listeners from a location (includes other users listeners)
  static removeAllListeners = (location) => {
    off(ref(Database.db, location));
  }
}

//const analytics = getAnalytics(app);

module.exports = {
  Database
}