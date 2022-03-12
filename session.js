const {Database} = require("./api/firebase.js");


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

class Session{

    
    queue = ["test","test2"];
    sId = "";

    static joinSession(id){
        Session.sId = id;
        Database.initServer();
        Database.requestCredentials();
        Database.getData("Server/" + id, (snapshot) => { 
            Session.queue = snapshot.val();
        });
    
    }

    static test(){
        return Session.queue;
    }

    static getId(){
        return Session.sId;
    }

    static queueSong(songId){
        // Queue not currently working
        Session.queue.push(songId);
        Database.createData("Server/" + Session.sId, { "queue" : Session.queue});
    }

    static createSession(){
        Session.sId = generateSesId();
        Database.initServer();
        Database.requestCredentials();
        //let tQueue = Session.queue;
        Database.createData("Server/" + Session.sId, { "queue" : ["test2"]});
        //Database.createData("Server/" + Session.sId, { "queue" : ["test2"]});
        //Send id to firebase

    }

    static deleteSession(){
        Database.deleteData("Server/" + Session.sId);
        Session.sId = "";
    }
}

module.exports = {
    Session
}
exports.generateSesId = generateSesId;