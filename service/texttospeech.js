"use strict";

let mqtt = require('mqtt');
let os = require("os");
var picoSpeaker = require('pico-speaker');

// Define configuration
var picoConfig = {
  //  AUDIO_DEVICE: 'default:CARD=PCH',
    LANGUAGE: 'fr-FR'
 };
  

/**
 * event handler who listen to mqtt event message topics
 * , synthesys a text to speech throw the jack audio output
 */

//on se connecte au broker (localhost) et on suscribe aux event message
var client = mqtt.connect('mqtt://localhost', {
    clientId: 'tts_' + os.hostname()
})
client.on('connect', function () {
    //text to speech event topics 
    client.subscribe('im/event/rpiheart/tts');
    // Initialize with config
    picoSpeaker.init(picoConfig);
})
//A new text to speech event as arrived
client.on('message', function (topic, strPlayload) {
    var payLoad = JSON.parse(strPlayload);

    console.log('\x1b[34m%s\x1b[0m', "speech synthesys of "+payLoad.text);
    picoSpeaker.shutUp() ;

    picoSpeaker.speak(payLoad.text).then(function() {
        // console.log("done");
     }.bind(this));
})
