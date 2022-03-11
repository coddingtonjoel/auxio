var SpotifyWebApi = require('spotify-web-api-node');
const express = require("express");
const {Database} = require("./firebase.js");

let secret = "";

class SpotifyCred{

  
  static expiresIn;
  static accessToken;
  static refreshToken;
  
  static getToken(){
    return this.accessToken;
  }

  static login(code){
      Database.initServer();
      Database.requestCredentials();
      Database.getData("SpotifySecret/", (snapshot) => { 
          secret = snapshot.val();
          
      });
      //while(secret == "");

      setTimeout(() => {
        let spotifyApi = new SpotifyWebApi({
            redirectUri:"http://localhost:8080",
            clientId: "2bab0f940a6547628f9beb01de54e982",
            clientSecret: secret
        })
        spotifyApi.authorizationCodeGrant(code).then(
            function(data) {
              
              SpotifyCred.expiresIn = data.body['expires_in'];
              SpotifyCred.accessToken = data.body['access_token'];
              SpotifyCred.refreshToken = data.body['refresh_token'];
             
              // Set the access token on the API object to use it in later calls
              spotifyApi.setAccessToken(data.body['access_token']);
              spotifyApi.setRefreshToken(data.body['refresh_token']);
            },
            function(err) {
              console.log('Something went wrong!', err);
            }
          );
        }, 3000);
      
  }
}


module.exports = {
    SpotifyCred
}
