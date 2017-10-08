"use strict";
let mosca = require('mosca');
let mqtt = require('mqtt');
let ip = require("ip");
let os = require("os");
let mdns = require('mdns');

/**
 * Démare un broker mqtt sur le port standard 1883
 * Le broker gère aussi le mqtt sur websocket sur le port 3000
 * Le tous sans authentification, ni quelconque sécurité
 */
let moscaSettings = {
    port: 1883,
    //backend: ascoltatore,
    //persistence: mosca.persistence.Memory,
    //persistence: {
    //  factory: mosca.persistence.Mongo,
    //  url: 'mongodb://localhost:27017/mqtt'
    //},
    //backend: pubsubsettings
    //secure : { 
    //  port: 8443,
    //  keyPath: SECURE_KEY,
    //  certPath: SECURE_CERT,
    //}

    //stats: true, // publish stats in the $SYS/<id> topicspace
    //logger: {      level: 'debug'    },
    //publishNewClient: true,
    //publishClientDisconnect: true,
    http: {
        port: 3000,         //activated mqtt on ws
        //bundle: true,     mqtt.js n'est pas servi par ce bias
        //static: './'
    }
};

//TODO to take from web.js
const HTTP_PORT = 8080;

let server = new mosca.Server(moscaSettings);
//Wire in memory persistence
let db = new mosca.persistence.Memory();
db.wire(server);

server.on('ready', function () {
    console.log('\x1b[35m%s\x1b[0m', "brocker is up on " + ip.address());

    var txt_record = {name: 'im-broker'};
    let serviceType = mdns.makeServiceType({name: 'mqtt', protocol: 'tcp', subtypes: ['im-broker']});
    let ad = mdns.createAdvertisement(serviceType, 1883,{txtRecord: txt_record});
    ad.start();

/*
    var sequence = [
        mdns.rst.DNSServiceResolve(),
        'DNSServiceGetAddrInfo' in mdns.dns_sd ? mdns.rst.DNSServiceGetAddrInfo() : mdns.rst.getaddrinfo({families:[4]}),
        mdns.rst.makeAddressesUnique()
    ];

    var browser = mdns.createBrowser(mdns.tcp('mqtt'), {resolverSequence: sequence});
    browser.on('serviceUp', function(service) {
      console.log("service up: ", service);
    });
    browser.on('serviceDown', function(service) {
      console.log("service down: ", service);
    });
    browser.start();
*/

    publishServerInfo();
});

server.on('clientConnected', function (client) {
    console.log('\x1b[35m%s\x1b[0m', client.id + ' connected');
    publishUpdatedClientList();
});
server.on('clientDisconnected', function (client) {
    console.log('\x1b[35m%s\x1b[0m', client.id + ' disconnected');
    publishUpdatedClientList();
});

// fired when a message is received
server.on('published', function (packet, client) {
    //console.log('Published', packet.topic + " " +packet.payload);
});


function publishServerInfo() {
    let mqttMessage = {
        topic: "im/command/im/server",
        payload: JSON.stringify({ origin: "broker", ip:ip.address(), hostname:os.hostname(),mqttPort:moscaSettings.port,wsPort:moscaSettings.http.port,httpPort:HTTP_PORT}),
        qos: 0,
        retain: true
    };
    server.publish(mqttMessage);
}


function publishUpdatedClientList() {
    //console.log(Object.keys(server.clients));
    let mqttMessage = {
        topic: "im/command/im/clients",
        payload: JSON.stringify({ origin: "broker", clients: Object.keys(server.clients) }),
        qos: 0,
        retain: true
    };
    server.publish(mqttMessage);
}

    /** USELESS GET remote client IP
    * let stream = client.connection.stream;
    * var remoteAddress = stream && stream.remoteAddress;
    * if(!remoteAddress){
    *    //look websocket ip
    *    remoteAddress = stream.socket && stream.socket._socket && stream.socket._socket.remoteAddress;
    *}
    * console.log("XXXXXXXXXXXX",remoteAddress);
    */