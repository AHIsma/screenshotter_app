const DB = require('../public/ressources/DB.json')
const fs = require('fs')
const got = require('got')
const {google} = require('googleapis')
const configDrive = require('dotenv').config()

const oauth2Client = new google.auth.OAuth2(
    configDrive.parsed.CLIENT_ID,
    configDrive.parsed.CLIENT_SECRRET,
    configDrive.parsed.REDIRECT_URI
)

oauth2Client.setCredentials({refresh_token: configDrive.parsed.REFRESH_TOKEN})

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
})


var express = require('express');
var router = express.Router();
var screenshotmachine = require('screenshotmachine');
var length = DB.length 
var done

router.get('/', function(req, res, next) {
    done = 0
    DB.forEach(function(ws) {
        SSMachine(ws)
    })

    callback = function(err) {
        if (!err) {
            res.status(200).json({
                response: 'OK'
            })
        } else {
            res.status(err.status).json({
                response: err.msg
            })
        }
    }
});

module.exports = router;

function SSMachine(ws) {    
    var customerKey = '921622',
        secretPhrase = '', 
        options = {
          url : ws.website,
          dimension : '1920x1080', 
          device : 'desktop',
          format: 'jpg',
          cacheLimit: '0',
          delay: '200',
          zoom: '100'
        }
    var apiUrl = screenshotmachine.generateScreenshotApiUrl(customerKey, secretPhrase, options);

    var SSname = [ws.id,'_',ws.name,'.jpg'].join('')
    
    var SStream = got.stream(screenshotmachine.readScreenshot(apiUrl)['uri']['href'])
    
    SSave(SSname, SStream)
}

async function SSave(SSname, SStream) {
    try{
        var media = {
            mimeType: 'image/jpg',
            body: SStream,
        }
        var fileMetadata = {
            name: SSname,
            parents: ['1cWOkZVxNAUiwr4BwoNJYhMpoqsZPjqSe']
        }

        await drive.files.create({
            resource: fileMetadata,
            media: media
        }, function(err, msg){
            if (err) {
                callback(err)
                throw err
            } 
            done += 1
            if (done == length) {
                callback(0)
            }
        })
    }catch(error){
        console.log(error.message)
    }
    
}