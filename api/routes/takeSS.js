const DB = require('../public/ressources/DB.json')
const fs = require('fs')

var express = require('express');
var router = express.Router();
var screenshotmachine = require('screenshotmachine');

router.get('/', function(req, res, next) {
    var results = []
    DB.forEach(function(ws) {
        results.push(SSMachine(ws))
    })
    res.send(results);
});

module.exports = router;

function SSMachine(ws) {    
    var customerKey = 'c8ab2e',
        secretPhrase = '', 
        options = {
          url : ws.website,
          dimension : '1920x1080', 
          device : 'desktop',
          format: 'png',
          cacheLimit: '0',
          delay: '200',
          zoom: '100'
        }
    var apiUrl = screenshotmachine.generateScreenshotApiUrl(customerKey, secretPhrase, options);

    var SSname = [ws.id,'_',ws.name,'.jpg'].join('')
    
    screenshotmachine.readScreenshot(apiUrl).pipe(fs.createWriteStream(process.cwd()+'/images/'+SSname))
    return SSname
}