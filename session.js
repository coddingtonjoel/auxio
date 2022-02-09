function generateSesId(){
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < 10; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
        if(i == 2 || i == 5)
            result += '-'
    }
    return result;
}

function joinSession(id){

}

exports.generateSesId = generateSesId;