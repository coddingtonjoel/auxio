var SpotifyWebApi = require('spotify-web-api-node');
const express = require("express");
const {Database} = require("./firebase.js");

let secret = "";

class SpotifyCred{
  
  
  static expiresIn;
  static accessT;
  static refreshT;
  static spotifyApi;

  static getToken(){
    return SpotifyCred.accessT;
  }

  static test(){
      SpotifyCred.spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE').then(
        function(data) {
          console.log('Artist albums', data.body);
        },
        function(err) {
          console.error(err);
        }
      );
  }

  static refresh(){
     
      SpotifyCred.spotifyApi.refreshAccessToken().then(
          function(data) {
              console.log('The access token has been refreshed!');
    
              // Save the access token so that it's used in future calls
              SpotifyCred.accessT = data.body['access_token'];
              SpotifyCred.spotifyApi.setAccessToken(SpotifyCred.accessT);
          },
          function(err) {
              console.log('Could not refresh access token', err);
          }
      );
  }

  
  static login(code){
      Database.initServer();
      Database.requestCredentials();
      // TODO Daniel needs to make Database.getData() return a promise to avoid the setTimeout() workaround below
      Database.getData("SpotifySecret/", (snapshot) => { 
          secret = snapshot.val();
      });

      const successfulLogin = new Promise((res, rej) => {
        setTimeout(() => {
          SpotifyCred.spotifyApi = new SpotifyWebApi({
              redirectUri:"http://localhost:8080",
              clientId: "2bab0f940a6547628f9beb01de54e982",
              clientSecret: secret
          });
          SpotifyCred.spotifyApi.authorizationCodeGrant(code).then(
              function(data) {
                
                SpotifyCred.expiresIn = data.body['expires_in'];
                SpotifyCred.accessT = data.body['access_token'];
                SpotifyCred.refreshT = data.body['refresh_token'];
               
                // Set the access token on the API object to use it in later calls
                SpotifyCred.spotifyApi.setAccessToken(data.body['access_token']);
                SpotifyCred.spotifyApi.setRefreshToken(data.body['refresh_token']);
                res();
              },
              function(err) {
                console.log('Something went wrong!', err);
                rej();
              }
            );
          }, 2000);
      });        
      return successfulLogin;
  }
}


module.exports = {
    SpotifyCred
}
