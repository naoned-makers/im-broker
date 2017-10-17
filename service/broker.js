"use strict";
let mosca = require('mosca');
let mqtt = require('mqtt');
let ip = require("ip");
let os = require("os");
let mdns = require('mdns');


const MQTT_PORT = 1883;
const WS_PORT = 3000;

/**
 * Démare un broker mqtt sur le port standard 1883
 * Le broker gère aussi le mqtt sur websocket sur le port 3000
 * Le tous sans authentification, ni quelconque sécurité
 */
let moscaSettings = {
    port: MQTT_PORT,
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
        port: WS_PORT,         //activated mqtt on ws
        //bundle: true,     mqtt.js n'est pas servi par ce bias
        //static: './'
    }
};

let server = new mosca.Server(moscaSettings);
//Wire in memory persistence
let db = new mosca.persistence.Memory();
db.wire(server);

server.on('ready', function () {
    console.log('\x1b[35m%s\x1b[0m', "brocker is up on " + ip.address());
    var txt_record = {wsport: WS_PORT};    
    let serviceType = mdns.makeServiceType({ name: 'im-broker', protocol: 'tcp' });
    let ad = mdns.createAdvertisement(serviceType, MQTT_PORT,{txtRecord: txt_record});
    ad.start();
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

function publishUpdatedClientList() {
    //console.log(Object.keys(server.clients));
    let mqttMessage = {
        topic: "im/event/rpiheart/status",
        payload: JSON.stringify({brokerClients:Object.keys(server.clients)}),
        qos: 0,
        retain: true
    };
    server.publish(mqttMessage);
}