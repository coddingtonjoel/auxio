const {Database} = require("./api/firebase.js");
const {songStruct, SpotifyCred} = require("./api/spotify.js")


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

    static joinSession(id, mainWindow, io){  
        const sessionPromise = new Promise((res, rej) => {
            //start listening to the server
            Session.queueListener = Database.getData("Server/" + id + "/queue", (snapshot) => {
                try {
                    snapshot.val()[0]; //use a basic call to see if it is valid
                    Session.sId = id;
                    Session.queue = snapshot.val();
                    //console.log(Session.queue)
                    Session.songListener = Database.getData("Server/" + id + "/currentSong", (snapshot) => { // chain calls for both listeners
                        try{
                            snapshot.val().curr; //use a basic call to see if it is valid
                            setTimeout(() => {
                                if (Session.currentSong.curr.id !== "") {
                                    let globalTime = new Date();
                                    
                                    let offset =  Math.round(globalTime.getTime() / 1000) - snapshot.val().time.whenUpdated + snapshot.val().time.whereUpdated; //gets time in seconds since January 1, 1970
                                    //console.log(offset)
                                    mainWindow.webContents.send("player:change", {song: Session.currentSong.curr});
                                    io.emit("songEvent", {type: "start", song: Session.currentSong.curr, token: SpotifyCred.accessT});
                                    setTimeout(() => {
                                        io.emit("songEvent", {type: "seek", song: Session.currentSong.curr, newTime: offset * 1000 + 300});
                                    }, 300)
                                }
                            }, 250);
                            Session.sId = id;
                            Session.currentSong = snapshot.val();
                            //console.log(Session.currentSong)
                            res(true);
                        }catch(error){
                            res(false);
                        } 
                    });
                } catch (error) {
                    res(false);
                }
            });
            
        })
        return sessionPromise;
    }


    static nextSong(){
        Session.currentSong.curr = Session.queue[0]; //Set the current song to the first one on the queue
        Session.queue.splice(0, 1);
        if (Session.queue.length == 0){ //If the queue is now empty, replace it with an empty queue
            Session.clearQueue();
        } else { //Write the new queue without the element to the server
            Database.createData("Server/" + Session.sId, { "queue" : Session.queue, "currentSong" : Session.currentSong});
        }
    }


    //Shuffle algorithm gotten from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array, adapted to fit our needs
    static shuffleQueue(){
        for (let i = Session.queue.length - 1; i > 0; i--) { 
            let j = Math.floor(Math.random() * (i + 1));
            [Session.queue[i], Session.queue[j]] = [Session.queue[j], Session.queue[i]]; // swap two elements 
        }
        Database.createData("Server/" + Session.sId, { "queue" : Session.queue, "currentSong" : Session.currentSong});
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
        Session.currentSong = song;
        Database.createData("Server/" + Session.sId, { "queue" : Session.queue, "currentSong" : Session.currentSong});
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

    static createSession(mainWindow){
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
                //console.log("Server does not exist");
            }

        });

        Session.songListener = Database.getData("Server/" + Session.sId + "/currentSong", (snapshot) => { //listener for current song information
            if(snapshot.exists()) {
                Session.currentSong = snapshot.val();
                setTimeout(() => {
                    if (Session.currentSong.curr.id !== "") {
                        mainWindow.webContents.send("player:change", {song: Session.currentSong.curr});
                    }
                }, 250);
            } else {
                //console.log("Server does not exist");
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
    Session,
    timeStruct,
    curSong
}
exports.generateSesId = generateSesId;