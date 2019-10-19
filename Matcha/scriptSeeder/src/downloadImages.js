const fs = require('fs');
const uuidv4 = require('uuid/v4');
const request = require('request');

let utility = [];

// fs.readFile('./data/male-pictures-1563125225059.json', 'utf8', (err, usersPP) => {
fs.readFile('./data/female-pictures-1563124616049.json', 'utf8', (err, usersPP) => {
    if (err) {
        console.log("Error reading file from disk:", err);
        return
    }
    try {

        const parsedUsersPP = JSON.parse(usersPP);
        parsedUsersPP.map(picture =>
            downloadImage(picture, function(){
                // console.log('done');
            })
        );
        console.log(utility)

        fs.writeFile('test.sql', JSON.stringify(utility), function (err) {
            if (err)
                return console.log(err);
            console.log('Seed has been watered correctly');
        });

    } catch(err) {
        console.log('Error parsing JSON string:', err)
    }
});

///////////////////////////////////////////////////
////                                           ////
////             utility functions             ////
////                                           ////
///////////////////////////////////////////////////

function downloadImage(uri, callback){
    const pictureId = uuidv4();
    utility = [...utility, pictureId];
    const filename = `${pictureId}.jpg`;

    request.head(uri, function(err, res, body){
        // console.log('content-type:', res.headers['content-type']);
        // console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(`./data/femaleImg/${filename}`)).on('close', callback);
        // request(uri).pipe(fs.createWriteStream(`./data/maleImg/${filename}`)).on('close', callback);
    });
};