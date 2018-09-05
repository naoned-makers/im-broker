"use strict";

let mqtt = require('mqtt');
let os = require("os");
let player = require("play-sound")({players: [
    'mpg123',
    'mpg321',
    'play',
    'cmdmp3'
   ]});

var audio;

/**
 * event handler who listen to mqtt event message topics
 * and play the local mp3 file throw the jack audio output
 */

//on se connecte au broker (localhost) et on suscribe aux event message
var client = mqtt.connect('mqtt://localhost', {
    clientId: 'sound_' + os.hostname()
})
client.on('connect', function () {
    //play sound event topics 
    client.subscribe('im/event/rpiheart/audio');

})
//A new sound event as arrived
client.on('message', function (topic, strPlayload) {
    var payLoad = JSON.parse(strPlayload);

    console.log('\x1b[34m%s\x1b[0m', "audio "+ player.player +" " + __dirname + '/../sound/'+payLoad.filename);

    if(audio){
        audio.kill();;
        audio = undefined;
    }
     
    // access the node child_process in case you need to kill it on demand
    audio = player.play(__dirname + '/../sound/'+payLoad.filename, function(err){
        if (err && !err.killed){
            console.log('error', err,player);
            if(err == 1){console.log('sound file not found')}
            if(err == 2){console.log('audio player error ')}
        } 
    })
})
