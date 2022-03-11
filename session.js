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

    queue = [];

    static joinSession(id){
        Database.initServer();
        Database.requestCredentials();
        Database.getData("Server/" + id, (snapshot) => { 
        
            snapshot.val();
        });
    
    }

    static createSession(){
        id = generateSesId();
        Database.initServer();
        Database.requestCredentials();
        Database.createData("Server/" + id, {});
        //Send id to firebase

    }

    static deleteSession(id){
        Database.deleteData("Server/" + id);
    }
}

module.exports = {
    Session
}
exports.generateSesId = generateSesId;