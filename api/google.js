
//note everything in GoogleCred is static since credentials should be the same throughout the entire application.
class GoogleCred
{
  static credentials = null; //the credentials
  static credExist = false; //if the credentials exist
  
  //request the credentials
  static getCredentials = () => {
    return GoogleCred.credentials;
  }
  
  //set the credentials
  static setCredentials = (creds) => {
    GoogleCred.credentials = creds;
    GoogleCred.credExist = true;
  }
  
  //reset the credentials back to null
  static clearCredentials = (creds) => {
    GoogleCred.credentials = null;
    GoogleCred.credExist = false;
  }
}

module.exports = {
  GoogleCred
}






/*
// *** NOTE *** previous work, this may be needed in the future, but likely will be discared

//check with: https://www.npmjs.com/package/electron-google-oauth

const {app, authentification} = require("./firebase");
const { signInWithPopup, GoogleAuthProvider } = require("firebase/auth");

const provider = new GoogleAuthProvider();

console.log(authentification);

signInWithPopup(authentification, provider) //sign in function
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    console.log(credenial);
    console.log(credenial.accessToken);
    console.log(token);
    console.log(user.email);
    // ...
  }).catch((error) => {
    //console.log(auth, provider);
    console.log("Error: sign in failed");
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.log(error.code);
    console.log(error.message);
    console.log(credential);
    // ...
  });
 

  module.exports = {
    signInWithPopup
  }

const { getAuth, onAuthStateChanged, signInWithCredential, GoogleAuthProvider } = require("firebase/auth"); //for firebase authentification

const auth = getAuth();

function onGoogleSignIn(googleUser) 
{
  console.log("testing");
  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

function isUserEqual(googleUser, firebaseUser) 
{
  if (firebaseUser) 
  {
    const providerData = firebaseUser.providerData;
    for (let i = 0; i < providerData.length; i++) {
      if (providerData[i].providerId === GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()) 
      {
        // We don't need to reauth the Firebase connection.
        return true;
      }
    }
  }
  return false;
}

function onFirebaseSignIn(googleUser) 
{
  console.log('Google Auth Response', googleUser);
  // We need to register an Observer on Firebase Auth to make sure auth is initialized.
  const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    unsubscribe();
    // Check if we are already signed-in Firebase with the correct user.
    if (!isUserEqual(googleUser, firebaseUser)) {
      // Build Firebase credential with the Google ID token.
      const credential = GoogleAuthProvider.credential(
          googleUser.getAuthResponse().id_token);

      // Sign in with credential from the Google user.
      signInWithCredential(auth, credential).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        console.log(errorCode, errorMessage);
        // The credential that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
    } else {
      console.log('User already signed-in Firebase.');
    }
  });
}

module.exports = {
  onGoogleSignIn
}

*/