"use strict";
let http = require('http');
let express = require('express');
let app = express();
let server = http.createServer(app);
let ip = require("ip");
let path = require('path');
let mdns = require('mdns');

const HTTP_PORT = 8080;

//#########################
//for serving html files
//#########################
app.use(express.static(path.join(__dirname + '/../web/assets')));
app.get('/', function (req, res, next) {
    //console.log('arrivé sur la page...');
    res.sendFile(path.join(__dirname + '/../web/index.html'));
});
server.listen(HTTP_PORT);
console.log('\x1b[35m%s\x1b[0m',"web server is up on "+ip.address()+":"+HTTP_PORT);
let serviceType = mdns.makeServiceType({name: 'im-web', protocol: 'tcp'});
let ad = mdns.createAdvertisement(serviceType, HTTP_PORT);
ad.start();