"use strict";
let http = require('http');
let express = require('express');
let app = express();
let server = http.createServer(app);
let ip = require("ip");
let path = require('path');
var bonjour = require('bonjour')();

const HTTP_PORT = 8080;

//#########################
//for serving html files
//#########################
app.use(express.static(path.join(__dirname + '/../web/assets')));
app.get('/', function (req, res, next) {
    //console.log('arrivé sur la page...');
    res.sendFile(path.join(__dirname + '/../web/touchstart.html'));
});
app.get('/move', function (req, res, next) {
    //console.log('arrivé sur la page...');
    res.sendFile(path.join(__dirname + '/../web/touchmove.html'));
});
app.get('/next', function (req, res, next) {
    //console.log('arrivé sur la page...');
    res.sendFile(path.join(__dirname + '/../web/touchcolor.html'));
});
app.get('/color', function (req, res, next) {
    //console.log('arrivé sur la page...');
    res.sendFile(path.join(__dirname + '/../web/color.html'));
});
app.get('/pattern', function (req, res, next) {
    //console.log('arrivé sur la page...');
    res.sendFile(path.join(__dirname + '/../web/pattern.html'));
});
server.listen(HTTP_PORT);
console.log('\x1b[35m%s\x1b[0m',"web server is up on "+ip.address()+":"+HTTP_PORT);
bonjour.publish({ name: 'imweb', type: 'http',subtypes:["im","web"], port: HTTP_PORT, txt:{subtypes: ["im","web"]} });