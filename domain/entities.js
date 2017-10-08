"use strict";
let Rx = require('rxjs/Rx');

var entities = {};

//Entity internal volatile current state
entities.imState = {};

/**
 * leftarm entity domain
 * execute validation and consequential logic
 */
entities.leftarmEntity = function (client, entityCommand, playLoad) {
    //HITEC HS-5645MG 50Hz LEFT ARM
    const CHANNEL_LEFT_ARM = 0;
    const SERVO_MIN_LEFT_ARM = 170;  // Min pulse length out of 4096 POSITION BASSE
    const SERVO_MIDDLE_LEFT_ARM = 280;  // Middle pulse length out of 4096
    const SERVO_MAX_LEFT_ARM = 350;  // Max pulse length out of 4096 POSITION HAUTE 
    const SLEEP = 1000; // milliseconds between instructions   
    if (entityCommand == 'move') {

        //the instructions is ended afer 1 secondes
        var cadence = Rx.Observable.timer(0, SLEEP);
        var moves = Rx.Observable.from([SERVO_MIN_LEFT_ARM, SERVO_MIDDLE_LEFT_ARM, SERVO_MAX_LEFT_ARM, SERVO_MIN_LEFT_ARM]);
        Rx.Observable.zip(cadence, moves, (s1, s2) => s2).map((pulse) => JSON.stringify({ pulse: pulse }))
            .subscribe(function (pulseStrPlayload) {
                client.publish("im/event/rpiheart/pwmhat/" + CHANNEL_LEFT_ARM, pulseStrPlayload);
            })
    }
}
/**
 * rightarm entity domain
 * execute validation and consequential logic
 */
entities.rightarmEntity = function (client, entityCommand, playLoad) {
    //HITEC HS-5645MG 50Hz LEFT ARM
    const CHANNEL_RIGHT_ARM = 1;
    const SERVO_MIN_RIGHT_ARM = 480; // Min pulse length out of 4096 POSITION BASSE
    const SERVO_MIDDLE_RIGHT_ARM = 350;  // Middle pulse length out of 4096
    const SERVO_MAX_RIGHT_ARM = 290;  // Max pulse length out of 4096 POSITION HAUTE
    const SLEEP = 1000; // milliseconds between instructions   
    if (entityCommand == 'move') {

        //the instructions is ended afer 1 secondes
        var cadence = Rx.Observable.timer(0, SLEEP);
        var moves = Rx.Observable.from([SERVO_MIN_RIGHT_ARM, SERVO_MIDDLE_RIGHT_ARM, SERVO_MAX_RIGHT_ARM, SERVO_MIN_RIGHT_ARM]);
        Rx.Observable.zip(cadence, moves, (s1, s2) => s2).map((pulse) => JSON.stringify({ pulse: pulse }))
            .subscribe(function (pulseStrPlayload) {
                client.publish("im/event/rpiheart/pwmhat/" + CHANNEL_RIGHT_ARM, pulseStrPlayload);
            })
        /** 
        # TODO   pwm.setPWM(CHANNEL_RIGHT_ARM, 0, SERVO_MIN_RIGHT_ARM)
        print "Bras droit à moitié levé"
        time.sleep(sleep)
        # TODO   pwm.setPWM(CHANNEL_RIGHT_ARM, 0, SERVO_MIDDLE_RIGHT_ARM)
        print "Bras droit à complétement levé"
        time.sleep(sleep)
        # TODO   pwm.setPWM(CHANNEL_RIGHT_ARM, 0, SERVO_MAX_RIGHT_ARM)
        print "Bras droit à moitié levé"
        time.sleep(sleep)
        # TODO   pwm.setPWM(CHANNEL_RIGHT_ARM, 0, SERVO_MIN_RIGHT_ARM)
        print "Bras droit à complétement baissé"
        time.sleep(sleep)
        */
    }
}
/**
 * head entity domain
 * execute validation and consequential logic
 */
entities.headEntity = function (client, entityCommand, inPlayLoad) {
    //HITEC HS-5645MG 50Hz LEFT ARM
    const CHANNEL_HEAD = 2;
    const SERVO_MIN_HEAD = 165;//Min pulse length out of 4096 POSITION BASSE
    const SERVO_MIDDLE_HEAD = 305;// Middle pulse length out of 4096
    const SERVO_MAX_HEAD = 450;// Max pulse length out of 4096 POSITION HAUTE
    const SLEEP = 1000; // milliseconds between instructions   

    if (entityCommand == 'move') {
        //the instructions is ended afer 1 secondes
        var cadence = Rx.Observable.timer(0, SLEEP);
        var moves = Rx.Observable.from([SERVO_MIDDLE_HEAD, SERVO_MAX_HEAD, SERVO_MIN_HEAD, SERVO_MIDDLE_HEAD]);
        Rx.Observable.zip(cadence, moves, (s1, s2) => s2).map((pulse) => JSON.stringify({ pulse: pulse }))
            .subscribe(function (pulseStrPlayload) {
                client.publish("im/event/rpiheart/pwmhat/" + CHANNEL_HEAD, pulseStrPlayload);
            })
    }
    if (entityCommand == 'facetrackmove') {
        //    /im/command/head/facetrackstart
        //          {origin:'camera',face:'base64faceimage',absPosition:%}
        //     /im/command/head/facetrackmove
        //          {origin:'camera',absPosition:%}
        //      /im/command/head/facetrackend
        //          {origin:'camera'}
        let currentPulse = SERVO_MIN_HEAD + inPlayLoad.absPosition*(SERVO_MAX_HEAD-SERVO_MIN_HEAD)/100;
        let pulseStrPlayload = JSON.stringify({ pulse: currentPulse });
        client.publish("im/event/rpiheart/pwmhat/" + CHANNEL_HEAD, pulseStrPlayload);
    }
}
/**
* lefthand entity domain
* execute validation and consequential logic
*/
entities.lefthandEntity = function (client, entityCommand, playLoad) {
    // HITEC HS-5645MG 50Hz LEFT ARM
    const CHANNEL_LEFT_HAND = 5
    const SERVO_MIN_LEFT_HAND = 160  // Min pulse length out of 4096 POSITION BASSE
    const SERVO_MIDDLE_LEFT_HAND = 240  // Middle pulse length out of 4096
    const SERVO_MAX_LEFT_HAND = 350  // Max pulse length out of 4096 POSITION HAUTE
    const SLEEP = 1000; // milliseconds between instructions   
    if (entityCommand == 'move') {
        //the instructions is ended afer 1 secondes
        var cadence = Rx.Observable.timer(0, SLEEP);
        var moves = Rx.Observable.from([SERVO_MIDDLE_LEFT_HAND, SERVO_MAX_LEFT_HAND, SERVO_MIN_LEFT_HAND, SERVO_MIDDLE_LEFT_HAND]);
        Rx.Observable.zip(cadence, moves, (s1, s2) => s2).map((pulse) => JSON.stringify({ pulse: pulse }))
            .subscribe(function (pulseStrPlayload) {
                client.publish("im/event/rpiheart/pwmhat/" + CHANNEL_LEFT_HAND, pulseStrPlayload);
            })
        /*
        # TODO   pwm.setPWM(CHANNEL_LEFT_HAND, 0, SERVO_MIDDLE_LEFT_HAND)
          print "Main gauche à moitié tournée"
          time.sleep(sleep)
        # TODO   pwm.setPWM(CHANNEL_LEFT_HAND, 0, SERVO_MAX_LEFT_HAND)
          print "Main gauche à complétement tournée"
          time.sleep(sleep)
        # TODO   pwm.setPWM(CHANNEL_LEFT_HAND, 0, SERVO_MIN_LEFT_HAND)
          print "Main gauche à moitié tournée"
          time.sleep(sleep)
        # TODO   pwm.setPWM(CHANNEL_LEFT_HAND, 0, SERVO_MIDDLE_LEFT_HAND)
          print "Main gauche à complétement tourné"
          time.sleep(sleep)
        */
    }
}

/**
* eyes entity domain
* execute validation and consequential logic
*/
entities.eyesEntity = function (client, entityCommand, inPlayLoad) {
    // HITEC HS-5645MG 50Hz LEFT ARM
    const LED_RED_CHANNEL = 5;
    const LED_GREEN_CHANNEL = 7;
    const LED_BLUE_CHANNEL = 6;
    const PWM_MIN = 0;  // Min pulse length out of 4096 POSITION BASSE
    const PWM_MAX = 4096;  // Max pulse length out of 4096 POSITION HAUTE
    if (entityCommand == 'on') {
        let pulse=PWM_MAX;
        client.publish("im/event/rpiheart/pwmhat/" + LED_RED_CHANNEL, JSON.stringify({ pulse: 300 }));
        client.publish("im/event/rpiheart/pwmhat/" + LED_GREEN_CHANNEL, JSON.stringify({ pulse: 300 }));
        client.publish("im/event/rpiheart/pwmhat/" + LED_BLUE_CHANNEL, JSON.stringify({ pulse: 3000 }));
    }else if (entityCommand == 'off') {
        let pulse=PWM_MIN;
        client.publish("im/event/rpiheart/pwmhat/" + LED_RED_CHANNEL, JSON.stringify({ pulse: pulse }));
        client.publish("im/event/rpiheart/pwmhat/" + LED_GREEN_CHANNEL, JSON.stringify({ pulse: pulse }));
        client.publish("im/event/rpiheart/pwmhat/" + LED_BLUE_CHANNEL, JSON.stringify({ pulse: pulse }));
    }else if (entityCommand == 'color') {
        let a = parseInt(inPlayLoad.rgba.substr(6,2), 16)/256;
        let r = Math.round(parseInt(inPlayLoad.rgba.substr(0,2), 16)/256*4096*a);
        let g = Math.round(parseInt(inPlayLoad.rgba.substr(2,2), 16)/256*4096*a);
        let b = Math.round(parseInt(inPlayLoad.rgba.substr(4,2), 16)/256*4096*a);
        client.publish("im/event/rpiheart/pwmhat/" + LED_RED_CHANNEL, JSON.stringify({ pulse: r }));
        client.publish("im/event/rpiheart/pwmhat/" + LED_GREEN_CHANNEL, JSON.stringify({ pulse: g }));
        client.publish("im/event/rpiheart/pwmhat/" + LED_BLUE_CHANNEL, JSON.stringify({ pulse: b }));
    }
}
/**
* righthand entity domain
* execute validation and consequential logic
*/
entities.righthandEntity = function (client, entityCommand, playLoad) {
    // HITEC HS-5645MG 50Hz LEFT ARM
    const CHANNEL_RIGHT_HAND = 4
    const SERVO_MIN_RIGHT_HAND = 240  // Min pulse length out of 4096 POSITION BASSE
    const SERVO_MIDDLE_RIGHT_HAND = 360  // Middle pulse length out of 4096
    const SERVO_MAX_RIGHT_HAND = 440  // Max pulse length out of 4096 POSITION HAUTE
    const SLEEP = 1000; // milliseconds between instructions   
    if (entityCommand == 'move') {
        //the instructions is ended afer 1 secondes
        var cadence = Rx.Observable.timer(0, SLEEP);
        var moves = Rx.Observable.from([SERVO_MIDDLE_RIGHT_HAND, SERVO_MAX_RIGHT_HAND, SERVO_MIN_RIGHT_HAND, SERVO_MIDDLE_RIGHT_HAND]);
        Rx.Observable.zip(cadence, moves, (s1, s2) => s2).map((pulse) => JSON.stringify({ pulse: pulse }))
            .subscribe(function (pulseStrPlayload) {
                client.publish("im/event/rpiheart/pwmhat/" + CHANNEL_RIGHT_HAND, pulseStrPlayload);
            })
        /*
        # TODO REMOVE pwm.setPWM(CHANNEL_RIGHT_HAND, 0, SERVO_MIDDLE_RIGHT_HAND)
        print "Main droite à moitié tournée"
        time.sleep(sleep)
        # TODO REMOVE pwm.setPWM(CHANNEL_RIGHT_HAND, 0, SERVO_MAX_RIGHT_HAND)
        print "Main droite à complétement tournée"50
PWM CHANNEL:2 setPWM:450
        time.sleep(sleep)
        # TODO REMOVE pwm.setPWM(CHANNEL_RIGHT_HAND, 0, SERVO_MIDDLE_RIGHT_HAND)
        print "Main droite à moitié tournée"
        time.sleep(sleep)
        # TODO REMOVE pwm.setPWM(CHANNEL_RIGHT_HAND, 0, SERVO_MIN_RIGHT_HAND)
        print "Main droite à complétement tourné"
        time.sleep(sleep)
        */
    }
}

/**
* im aggregate domain
* execute validation and consequential logic
*/
entities.imEntity = function (client, entityCommand, inPlayLoad) {

    if (entityCommand == 'server') {
        //update internal state
        entities.imState.server=inPlayLoad;
        client.publish("im/event/rpiheart/status",JSON.stringify(entities.imState),{retain:true});
    }

    if (entityCommand == 'clients') {
        //update internal state
        entities.imState.brokerClients=inPlayLoad.clients;
        client.publish("im/event/rpiheart/status",JSON.stringify(entities.imState),{retain:true});
    }
    if (entityCommand == 'reset') {
        client.publish("im/event/rpiheart/pwmhat/reset","");
        //client.publish("im/event/rpiheart/ring/off","");
    }

}
/**
* im aggregate domain
* execute validation and consequential logic
*/
entities.energyEntity = function (client, entityCommand, inPlayLoad) {

        let evtPayLoad = inPlayLoad;
        evtPayLoad.red=parseInt(inPlayLoad.rgb.substr(0,2), 16)
        evtPayLoad.green=parseInt(inPlayLoad.rgb.substr(2,2), 16)
        evtPayLoad.blue=parseInt(inPlayLoad.rgb.substr(4,2), 16)
        evtPayLoad.speed = inPlayLoad.speed/1000.0;
        delete evtPayLoad.origin;
        delete evtPayLoad.rgb;

        if (entityCommand == 'on') {
            client.publish("im/event/rpiheart/neopixel/on",JSON.stringify(evtPayLoad));
        }else if (entityCommand == 'off') {
            client.publish("im/event/rpiheart/neopixel/off",JSON.stringify(evtPayLoad));
        }else if (entityCommand == 'beat') {
            client.publish("im/event/rpiheart/neopixel/beat",JSON.stringify(evtPayLoad));
        }else if (entityCommand == 'chase') {
            client.publish("im/event/rpiheart/neopixel/chase",JSON.stringify(evtPayLoad));
        }
    }
module.exports = entities;
