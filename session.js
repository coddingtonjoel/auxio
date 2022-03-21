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

class Session {

    static queue = [];
    static sId = "";


    static joinSession(id){
        Session.sId = id;
        Database.initServer();
        Database.requestCredentials();
        Database.getData("Server/" + id + "/queue", (snapshot) => { 
            if(snapshot.exists()){
                Session.queue = snapshot.val();
                return true;
            }
            else{
                console.log("Server does not exist");
                return false;
            }
            //snapshot.forEach(item => {
                //let element = new songStruct;
                //element.title = 
            //});
           
            //console.log(Session.queue);
        });
    
    }

    static getId() {
        return Session.sId;
    }
    
    static leaveSession(){
        Session.queue = [];
        Session.sId = "";
        //Add code to disable current listeners
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
                if(Session.queue.length == 0){ //If the queue is now empty, replace it with an empty queue
                    Session.queue.push(empty)
                    Database.createData("Server/" + Session.sId, { "queue" : Session.queue});
                } else { //Write the new queue without the element to the server
                    Database.createData("Server/" + Session.sId, { "queue" : Session.queue});
                }
                break;
            }
        }
    }

    static createSession(){
        Session.sId = generateSesId();
        Database.initServer();
        Database.requestCredentials();
        Session.queue.push(empty);
        //console.log(Session.queue);
        Database.createData("Server/" + Session.sId, { "queue" : Session.queue});
        //Database.createData("Server/" + Session.sId, { "queue" : ["test2"]});
        //Send id to firebase

    }

    static deleteSession() {
        Database.deleteData("Server/" + Session.sId);
        Session.sId = "";
    }
}

module.exports = {
    Session
}
exports.generateSesId = generateSesId;