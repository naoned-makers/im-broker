"use strict";

let mqtt = require('mqtt');
let os = require("os");

/**
 * event handler who listen to mqtt event message topics
 * and play the local mp3 file throw the jack audio output
 */

//on se connecte au broker (localhost) et on suscribe aux event message
var client = mqtt.connect('mqtt://localhost', {
    clientId: 'sound_' + os.hostname()
})
client.on('connect', function () {
    //sound event topics look like  im/event/jack/pla
    client.subscribe('im/event/jack/play');

})
//A new sound event as arrived
client.on('message', function (topic, strPlayload) {
    //{ filename: \< string local filename value > }
})