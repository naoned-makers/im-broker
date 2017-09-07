let mosca = require('mosca');
let mqtt = require('mqtt');

/**
 * Démare un broker mqtt sur le port standard 1883
 * Le broker gère aussi le mqtt sur websocket sur le port 3000
 * Le tous sans authentification, ni quelconque sécurité
 */
var moscaSettings = {
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
    http: {
        port: 3000,         //activated mqtt on ws
        //bundle: true,     mqtt.js n'est pas servi par ce bias
        //static: './'
    }
};

var server = new mosca.Server(moscaSettings);
server.on('ready', function () {
    console.log('\x1b[35m%s\x1b[0m', "brocker is up");
});

server.on('clientConnected', function (client) {
    console.log('\x1b[35m%s\x1b[0m',client.id+' connected');
});
server.on('clientDisconnected', function (client) {
    console.log('\x1b[35m%s\x1b[0m',client.id+' disconnected');
});

// fired when a message is received
server.on('published', function (packet, client) {
    //console.log('Published', packet.topic + " " +packet.payload);
});
