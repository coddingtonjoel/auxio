var SpotifyWebApi = require('spotify-web-api-node');
const {Database} = require("./firebase.js");


let secret = "";


class songStruct{
  
  static album;
  static albumArt;
  static artist;
  static id;
  static title;
  static length;
  static uri;
}

class playlistStruct{
  static name;
  static albumArt;
  static id;
}

class SpotifyCred{
  
  
  static expiresIn;
  static accessT;
  static refreshT;
  static spotifyApi;

  static search(str){
    const completeList = new Promise((res, rej) => {
        //Search for the first 10 songs based on the string
        SpotifyCred.spotifyApi.searchTracks(str,{ limit: 8 }).then(function(data) {
          let songs = data.body.tracks.items;
          let returnSongs = [];

          //For each item, assign the relavent components to curr and then push into returnSongs
          songs.forEach(item => {
              let curr = new songStruct;
              curr.title = item.name;

              let artistArr = [];
              item.artists.forEach(item2 => { //Get every Artist
                artistArr.push(item2.name)
              });

              curr.artists = artistArr;
              curr.album = item.album.name; 
              curr.id = item.id;
 
              curr.albumArt = [item.album.images[0].url,item.album.images[2].url];
              curr.uri = item.uri;
              curr.length = Math.floor(item.duration_ms);
              returnSongs.push(curr);
          }); 
          res(returnSongs);
      }).catch(err => rej(err));
    });

    return completeList;
  }


  static getSongsInPlaylist(playlist){ //return an array of all the songStructs for a playlist
    const completeList = new Promise((res, rej) => {
      SpotifyCred.spotifyApi.getPlaylist(playlist).then(function(data) { //same general structure as search for creating a songStruct
        let returnSongs = [];
        data.body.tracks.items.forEach(item => {
          
          let curr = new songStruct;
          curr.title = item.track.name;
          

          let artistArr = [];
          item.track.artists.forEach(item2 => { //Get every Artist
            artistArr.push(item2.name)
          });

          curr.artists = artistArr;
          curr.album = item.track.album.name; 
          
          curr.id = item.track.id;

          curr.albumArt = [item.track.album.images[0].url,item.track.album.images[2].url]; 
          curr.uri = item.track.uri;
          curr.length = Math.floor(item.track.duration_ms);
          returnSongs.push(curr);
        });
        res(returnSongs);
      }).catch(err => rej(err));
    });
    return completeList;
  }


  static getHostPlaylists(){
    const completeList = new Promise((res, rej) => {
      SpotifyCred.spotifyApi.getMe().then(function(data) { //Get the current users id
        SpotifyCred.spotifyApi.getUserPlaylists(data.body.id).then(function(data) { //Based on id from user,get their playlists
          let playlists = [];
          data.body.items.forEach(item => { //For each playlist, format it into a playlist structure
            let curr = new playlistStruct;
            curr.name = item.name;
            curr.id = item.id;
            curr.albumArt = item.images[2].url;
            playlists.push(curr);
          }); 
          res(playlists);
          }).catch(err => rej(err));
      }).catch(err => rej(err));
    });
    return completeList;
  }


  static refresh(){ //Called periodically to refresh the token
    setTimeout(function(){
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
      SpotifyCred.refresh();
    },1740000);
  }

  
  static login(code){

      const successfulLogin = Database.getDataOnce("SpotifySecret/").then((snapshot) => 
      {
        
        if (!snapshot.exists()) {
          console.log("Spotify Login Failed: Spotify Secret Not Found!"); //secret not on database, this should never occur 
        } else {
          
          secret = snapshot.val(); //data retrieved

          //Initialize the spotifyApi object
          SpotifyCred.spotifyApi = new SpotifyWebApi({
            redirectUri:"http://localhost:8080",
            clientId: "2bab0f940a6547628f9beb01de54e982",
            clientSecret: secret
          });
          SpotifyCred.spotifyApi.authorizationCodeGrant(code).then(
              function(data) {
                
                //Store the relavent data
                SpotifyCred.expiresIn = data.body['expires_in'];
                SpotifyCred.accessT = data.body['access_token'];
                SpotifyCred.refreshT = data.body['refresh_token'];
              
                // Set the access token on the API object to use it in later calls
                SpotifyCred.spotifyApi.setAccessToken(data.body['access_token']);
                SpotifyCred.spotifyApi.setRefreshToken(data.body['refresh_token']);
                SpotifyCred.refresh();
              },
              function(err) { console.log('Spotify Login: Something went wrong!', err); }
          );
          
        }
      }).catch((error) => {
        //console.log("error was found")
        SpotifyCred.login(code); //read from database failed
      });
      return successfulLogin;
  }
}


module.exports = {
    SpotifyCred,
    songStruct,
    playlistStruct
}
