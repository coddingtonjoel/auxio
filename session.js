const {Database} = require("./api/firebase.js");
const {songStruct} = require("./api/spotify.js")


function generateSesId(){
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; //List of characters to choose from
    for (let i = 0; i < 10; i++ ) { 
        result += characters.charAt(Math.floor(Math.random() * characters.length)); //Add a random character to result
        if(i == 2 || i == 5) //Add the - at indexes 3 and 6
            result += '-'
    }
    return result;
}

class timeStruct {
    static whenUpdated;
    static whereUpdated;
}

class curSong {
    static curr = new songStruct;
    static time = new timeStruct;
}

let empty = new songStruct;
empty.title = "";
empty.artist = [""];
empty.album = "";
empty.albumArt = "";
empty.id = "";
empty.length = "";
empty.uri = "";

let emptyCurrent = new curSong;
let emptyTime = new timeStruct;

emptyTime.whenUpdated = 0;
emptyTime.whereUpdated = 0;

emptyCurrent.curr = empty;
emptyCurrent.time = emptyTime;


class Session {

    // current song is blank by default when a session starts
    static currentSong = empty;
    static queue = [];
    static sId = "";
    static queueListener = null; //the listener function to the server id data
    static songListener = null;
    static host = false;

    static joinSession(id){  
        const sessionPromise = new Promise((res, rej) => {
            //start listening to the server
            let verified = [false, false];
            Session.queueListener = Database.getData("Server/" + id + "/queue", (snapshot) => {
                if(snapshot.exists()) {
                    Session.sId = id;
                    Session.queue = snapshot.val();
                    verified[0] = true;
                } else {
                    console.log("Server does not exist");
                    res(false);
                }
            });
            Session.songListener = Database.getData("Server/" + id + "/currentSong", (snapshot) => {
                if(snapshot.exists()) {
                    Session.sId = id;
                    Session.queue = snapshot.val();
                    verified[1] = true;
                } else {
                    console.log("Server does not exist");
                    res(false);
                }
            });
            res((verified[0] && verified[1]));
        })
        return sessionPromise;
    }


    static changeQueue(newQueue){
        //change the current queue to the new input
        if(newQueue.length == 0){ //Stop empty queues from deleting the server
            Session.clearQueue();
        }
        else {
            Session.queue = newQueue;
            Database.createData("Server/" + Session.sId, { "queue" : Session.queue, "currentSong" : Session.currentSong});
        }
    }

    static getId() {
        return Session.sId;
    }
    
    static leaveSession(){
        if(!Session.host){
            Database.removeListener("Server/" + Session.sId + "/queue"); //stop listening
            Database.removeListener("Server/" + Session.sId + "/currentSong"); //stop listening to the server
            Session.queue = []; //reset queues and id
            Session.sId = "";
            Session.currentSong = empty;
        }
    }

    static changeCurrentSong(song) {
        Session.currentSong.curr = song;
    }

    static queueSong(song){
        if (Session.queue[0].album == ""){ //If the first song is a filler song, clear it and then push the new song on top
            Session.queue = [];
            Session.queue.push(song);
            Database.createData("Server/" + Session.sId, { "queue" : Session.queue, "currentSong" : Session.currentSong});
        }
        else { //If there are already songs in queue
            Session.queue.push(song);
            Database.createData("Server/" + Session.sId, { "queue" : Session.queue, "currentSong" : Session.currentSong});
        }
    }

    static clearQueue(){ //Called by the host to clear the queue
        Session.queue = [];
        Session.queue.push(empty);
        Database.createData("Server/" + Session.sId, { "queue" : Session.queue, "currentSong" : Session.currentSong});
    }


    static deleteSong(songId){ //Delete a specific song from queue
        for (let i = 0; i < Session.queue.length; i++) {
            if (Session.queue[i].id == songId){
                Session.queue.splice(i, 1); //Delete the element at index i
                //console.log(Session.queue);
                if(Session.queue.length == 0){ //If the queue is now empty, replace it with an empty queue
                    Session.clearQueue();
                } else { //Write the new queue without the element to the server
                    Database.createData("Server/" + Session.sId, { "queue" : Session.queue, "currentSong" : Session.currentSong});
                }
                break;
            }
        }
    }


    static isHost(){
        return Session.host;
    }

    static createSession(){
        Session.host = true;
        Session.sId = generateSesId();
        //Session.sId =  "TES-TSE-RVER";
        Session.queue.push(empty);
        Session.currentSong = emptyCurrent;

        Database.createData("Server/" + Session.sId, { "queue" : Session.queue, "currentSong" : Session.currentSong});

        Session.queueListener = Database.getData("Server/" + Session.sId + "/queue", (snapshot) => { //listener to queue information
            if(snapshot.exists()) {
                Session.queue = snapshot.val();
            } else {
                console.log("Server does not exist");
            }

        });

        Session.songListener = Database.getData("Server/" + Session.sId + "/currentSong", (snapshot) => { //listener for current song information
            if(snapshot.exists()) {
                Session.currentSong = snapshot.val();
            } else {
                console.log("Server does not exist");
            }

        });
        return Session.sId;
        //Database.createData("Server/" + Session.sId, { "queue" : ["test2"]});
        //Send id to firebase

    }

    static deleteSession() {
        if(Session.host && Session.sId != ""){
            
            Database.deleteData("Server/" + Session.sId);
            Database.removeListener("Server/" + Session.sId + "/queue"); //stop listening to the server
            Database.removeListener("Server/" + Session.sId + "/currentSong"); //stop listening to the server
           
            
            Session.sId = "";
            Session.host = false;
            Session.currentSong = empty;
            Session.queue = [];
        }
    }
}   

module.exports = {
    Session
}
exports.generateSesId = generateSesId;