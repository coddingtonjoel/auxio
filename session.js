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

let empty = new songStruct;
empty.title = "";
empty.artist = [""];
empty.album = "";
empty.albumArt = "";
empty.id = "";
empty.length = "";
empty.uri = "";

class Session {

    // current song is blank by default when a session starts
    static currentSong = empty;
    static queue = [];
    static sId = "";
    static listenerFunc = null; //the listener function to the server id data
    static host = false;

    static joinSession(id){  
        const sessionPromise = new Promise((res, rej) => {
            //start listening to the server
            Session.listenerFunc = Database.getData("Server/" + id + "/queue", (snapshot) => {
                if(snapshot.exists()) {
                    Session.sId = id;
                    Session.queue = snapshot.val();
                    res(true);
                } else {
                    console.log("Server does not exist");
                    res(false);
                }
                //snapshot.forEach(item => {
                    //let element = new songStruct;
                    //element.title = 
                //});
               
                //console.log(Session.queue);
            });
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
            Database.createData("Server/" + Session.sId, { "queue" : Session.queue});
        }
    }

    static getId() {
        return Session.sId;
    }
    
    static leaveSession(){
        if(!Session.host){
            Session.host = false;
            Database.removeListener("Server/" + Session.sId + "/queue"); //stop listening
            Session.queue = []; //reset queues and id
            Session.sId = "";
        }
    }

    static changeCurrentSong(song) {
        this.currentSong = song;
    }

    static queueSong(song){
        if (Session.queue[0].album == ""){ //If the first song is a filler song, clear it and then push the new song on top
            Session.queue = [];
            Session.queue.push(song);
            Database.createData("Server/" + Session.sId, { "queue" : Session.queue});
        }
        else { //If there are already songs in queue
            Session.queue.push(song);
            Database.createData("Server/" + Session.sId, { "queue" : Session.queue});
        }
    }

    static clearQueue(){ //Called by the host to clear the queue
        Session.queue = [];
        Session.queue.push(empty);
        Database.createData("Server/" + Session.sId, { "queue" : Session.queue});
    }


    static deleteSong(songId){ //Delete a specific song from queue
        for (let i = 0; i < Session.queue.length; i++) {
            if (Session.queue[i].id == songId){
                Session.queue.splice(i, 1); //Delete the element at index i
                //console.log(Session.queue);
                if(Session.queue.length == 0){ //If the queue is now empty, replace it with an empty queue
                    Session.clearQueue();
                } else { //Write the new queue without the element to the server
                    Database.createData("Server/" + Session.sId, { "queue" : Session.queue});
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
        Session.queue.push(empty);
        //console.log(Session.queue);
        Database.createData("Server/" + Session.sId, { "queue" : Session.queue});
        return Session.sId;
        //Database.createData("Server/" + Session.sId, { "queue" : ["test2"]});
        //Send id to firebase

    }

    static deleteSession() {
        if(Session.host && Session.sId != ""){
            Database.deleteData("Server/" + Session.sId);
            Database.removeListener("Server/" + Session.sId + "/queue"); //stop listening to the server
            Session.sId = "";
        }
    }
}   

module.exports = {
    Session
}
exports.generateSesId = generateSesId;