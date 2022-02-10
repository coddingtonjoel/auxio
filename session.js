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

function joinSession(id){
    
   
    //socket = Call firebase to get shared socket information and store it in socket
    //while(socket == -1) 
       // socket = Call firebase to get shared socket information and store it in socket
    
}

function createSession(){
    id = generateSesId();
    //Send id to firebase

}

exports.generateSesId = generateSesId;