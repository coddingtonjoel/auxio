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
    static isPaused;
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
emptyTime.isPaused = false;

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
    static serverConnected = false;

    static joinedMid = true;
    static lastSessionUpdate = empty; //used for song listener syncing

    //todo: unpause when slider moves to beginning / prev button (frontend)
    //don't unpause when slider position moves elsewhere (frontend)
    //update pause button when changed on the session (frontend)
    //test syncing
    //occasional skip end of song
    //pause/play button refusal
    //final song finished, can't skip back to the main song.
    static joinSession(id, mainWindow, io){  
        const sessionPromise = new Promise((res, rej) => {
            //start listening to the server

            Session.sId = id;
            Session.songListener = Database.getData("Server/" + id + "/currentSong", (snapshot) => { // chain calls for both listeners
                try {
                    
                    
                    if(Session.serverConnected && snapshot.val() === null) //server must have been closed / deleted, exit and remove listener
                    {
                        console.log("Server Shutdown!");
                        io.emit("pause"); //to prevent song continue playing after returning to main screen
                        Session.leaveSession(); //remove listeners
                        mainWindow.webContents.send("session:leave", {}) //leave the session and return to main screen.
                    }
                    // !!!!! Important: use a basic call to see if it is valid, if not, catch occurs
                    snapshot.val().curr;
                    Session.serverConnected = true; //reading data, must be valid server
                    // -----------------------------------------------------------------------------
                    
                    if(Session.joinedMid) //special case for initial server join
                    {
                        if(snapshot.val().time.whereUpdated != 0)
                        {
                            io.emit("songEvent", {type: "start", song: snapshot.val().curr, token: SpotifyCred.accessT}); //start playing current song
                            //handle moving song position and pausing
                            setTimeout(() => {
                                //find correct song position
                                let globalTime = new Date();
                                //offset is lastKnownPosition + (timeSinceLastUpdate)
                                let offset =  Math.round(globalTime.getTime()) - snapshot.val().time.whenUpdated + snapshot.val().time.whereUpdated;
                                
                                if(snapshot.val().time.isPaused)
                                    io.emit("pause"); //pause then move, prevents skipping sounds
                                else
                                    io.emit("unpause"); //move then unpause, prevents skipping sounds
                                
                                io.emit("songEvent", {type: "seek", song: snapshot.val().curr, newTime: offset + 1000});
                                
                                mainWindow.webContents.send("player:change", {song: snapshot.val().curr}); //update player
                            }, 1000);
                        }
                        Session.joinedMid = false;
                    }
                    else //not mid join, normal behavior 
                    {
                        if(snapshot.val().time.whereUpdated == 0) //new song started playing
                        {
                            io.emit("songEvent", {type: "start", song: snapshot.val().curr, token: SpotifyCred.accessT}); //play song with credential
                            mainWindow.webContents.send("player:change", {song: Session.currentSong.curr}); //update player
                        }
                        else //time changing, not a new song
                        {
                            //find correct song position
                            let globalTime = new Date();
                            //offset is lastKnownPosition + (timeSinceLastUpdate)
                            let currTime = Math.round(globalTime.getTime());
                            let offset =  currTime - snapshot.val().time.whenUpdated + snapshot.val().time.whereUpdated;
                            let prevOffset = currTime - Session.lastSessionUpdate.time.whenUpdated + Session.lastSessionUpdate.time.whereUpdated;
                            if(snapshot.val().time.isPaused)
                                offset = snapshot.val().time.whereUpdated; //offest is the same if the player is paused
                            
                            //handle pausing
                            if(snapshot.val().time.isPaused != Session.lastSessionUpdate.time.isPaused) //only update pause if pause state changed
                            {
                                if(snapshot.val().time.isPaused)  
                                    io.emit("pause");
                                else
                                    io.emit("unpause");
                                //TODO: notify the front end of the pause button state
                            }
                                
                            if(offset != prevOffset) //if update position should be different, then seek
                                io.emit("songEvent", {type: "seek", song: snapshot.val().curr, newTime: offset}); //jump to correct position
                        }
                    }
                    //mainWindow.webContents.send("pauseEvent", {isPaused: true});
                    Session.currentSong = snapshot.val(); //update all data fields
                    Session.lastSessionUpdate = snapshot.val(); //update last known update

                } catch(error){
                    //console.log("error", error);
                    res(false);
                } 
            });
            
            Session.queueListener = Database.getData("Server/" + id + "/queue", (snapshot) => {
                try {
                    snapshot.val()[0]; //use a basic call to see if it is valid, catch if not
                    Session.sId = id;
                    Session.queue = snapshot.val(); //update all fields
                    res(true)
                } catch (error) {
                    res(false);
                }
            });
            
            
        })
        return sessionPromise;
    }

    static getSongPosition()
    {
        let globalTime = new Date();
        if(Session.currentSong.time.isPaused)
            return Session.currentSong.time.whereUpdated;
        else //current position is lastUpdatePosition + (timeSinceLastUpdate)
            return Session.currentSong.time.whereUpdated + (Math.round(globalTime.getTime()) - Session.currentSong.time.whenUpdated);
    }

    static pause()
    {
        let globalTime = new Date();
        //where location must be last known position + time elapsed since last move.
        Session.currentSong.time.whereUpdated = Math.round(globalTime.getTime()) - Session.currentSong.time.whenUpdated + Session.currentSong.time.whereUpdated;
        Session.currentSong.time.whenUpdated = Math.round(globalTime.getTime()); //current time
        Session.currentSong.time.isPaused = true;
        Database.createData("Server/" + Session.sId, { "queue" : Session.queue, "currentSong" : Session.currentSong}); //update
    }

    static unpause()
    {
        let globalTime = new Date();
        //where position should be fine as is.
        Session.currentSong.time.whenUpdated = Math.round(globalTime.getTime()); //current time
        Session.currentSong.time.isPaused = false;
        Database.createData("Server/" + Session.sId, { "queue" : Session.queue, "currentSong" : Session.currentSong}); //update
    }

    static resetSongPosition() //used for previous button, just reset position to 0
    {
        let globalTime = new Date();
        //where location must be last known position + time elapsed since last move.
        Session.currentSong.time.whereUpdated = 0; //at the start
        Session.currentSong.time.whenUpdated = Math.round(globalTime.getTime()); //current time
        Session.currentSong.time.isPaused = false; //unpause
        Database.createData("Server/" + Session.sId, { "queue" : Session.queue, "currentSong" : Session.currentSong}); //update
    }


    static nextSong(){
        Session.currentSong.curr = Session.queue[0]; //Set the current song to the first one on the queue
        let globalTime = new Date();
        Session.currentSong.time.whereUpdated = 0; //at the start
        Session.currentSong.time.whenUpdated = Math.round(globalTime.getTime()); //current time
        Session.currentSong.time.isPaused = false; //unpause

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

    static changeCurrentSong(song, position, pause) {
        //console.log(song);
        let globalTime = new Date();

        Session.currentSong.curr = song;
        Session.currentSong.time.whereUpdated = position;
        Session.currentSong.time.whenUpdated = Math.round(globalTime.getTime()); //current time
        Session.currentSong.time.isPaused = pause;

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

    static createSession(mainWindow, io){
        Session.host = true;
        Session.joinedMid = false;
        Session.serverConnected = true;
        Session.sId = generateSesId();
        //Session.sId =  "TES-TSE-RVER";
        Session.queue.push(empty);
        Session.currentSong = emptyCurrent;

        Database.createData("Server/" + Session.sId, { "queue" : Session.queue, "currentSong" : Session.currentSong});

        Session.joinSession(Session.sId, mainWindow, io); //set up song and queue listeners
        /*
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
        */

        return Session.sId;
        //Database.createData("Server/" + Session.sId, { "queue" : ["test2"]});
        //Send id to firebase

    }

    static leaveSession() 
    {
        Session.serverConnected = false;
        if(Session.sId != "" && typeof(io) != "undefined")
            io.emit("pause"); //pause then move, prevents skipping sounds
        Database.removeListener("Server/" + Session.sId + "/queue"); //stop listening to the server
        Database.removeListener("Server/" + Session.sId + "/currentSong"); //stop listening to the server
        
        Session.joinedMid = true;

        if(Session.host && Session.sId != "") { //close the server if host    
            Database.deleteData("Server/" + Session.sId);
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