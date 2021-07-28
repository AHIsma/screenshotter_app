const {google} = require('googleapis')
const fs = require('fs')
const path = require('path')

const CLIENT_ID = '70434748086-i7uvn9g4kb6totgbbc6ufhps9al0c3q9.apps.googleusercontent.com';
const CLIENT_SECRRET = 'ahwbmLHyejOTn101Ndayrc2J';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04rFep7Li1Ty5CgYIARAAGAQSNwF-L9Ir8d_kYWMPXREsLZYYrloAS0W3xU9PCWcO2FNEhGOKfThL6zk9bGEChvsJutE65d6Vej8';

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRRET,
    REDIRECT_URI
)
oauth2Client.setCredentials({refresh_token: REFRESH_TOKEN})

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
})

var express = require('express');
var router = express.Router();
router.post('/', function(req, res, next) {
    var params = req.body
    
    SSave(params[0])
    res.send('OK')
});

async function SSave(SSname) {
    const filepath = path.resolve(__dirname,'../images/'+SSname)
    console.log(filepath)
    var media = {
        mimeType: 'image/jpg',
        body: fs.createReadStream(filepath),
    }
    var fileMetadata = {
        name: SSname,
    }
    try{
        let response =  await drive.files.create({
            resource: fileMetadata,
            resumable: media,
        })
    }catch(error){
        console.log(error.message)
    }
    
}

module.exports = router;

