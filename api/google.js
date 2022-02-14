const { getAuth, signInWithPopup, GoogleAuthProvider } = require("firebase/auth");


const provider = new GoogleAuthProvider();
const auth = getAuth();

signInWithPopup(auth, provider) //sign in function
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