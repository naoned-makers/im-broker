"use strict";

let Rx = require('rxjs/Rx');
let stat = require('./stat.js');
let disk = require('diskusage');

var entities = {
    init: function (client) {
        const SLEEP = 1000; // milliseconds between instruction

        Rx.Observable.timer(0, 5000
        ).switchMap(() => Rx.Observable.fromPromise(new Promise((resolve, reject) => {
                    stat.cpuUsage(function (err, cpuUsageVal) {
                        if (!err) {
                            disk.check(".", function(err, info) {
                                if (err) {
                                    reject(err);
                                } else {
                                    // System states.
                                    resolve({ memory: stat.memory, cpuUsage: cpuUsageVal,disk:info });
                                }
                            });
                        } else {
                            reject(err);
                        }
                    })
                }))
            , (outerValue, innerValue) => innerValue
            ).subscribe((payload) => {
                client.publish("im/event/rpiheart/usage", JSON.stringify(payload));
            });
    }
};

//Entity internal volatile current state
entities.imState = {};

/**
 * leftarm entity domain
 * execute validation and consequential logic
 */
entities.leftarmEntity = function (client, entityCommand, playLoad) {
    //HITEC HS-5645MG 50Hz LEFT ARM
    const CHANNEL_LEFT_ARM = 0;
    const SERVO_MIN_LEFT_ARM = 165;  // Min pulse length out of 4096 POSITION BASSE
    const SERVO_MIDDLE_LEFT_ARM = 280;  // Middle pulse length out of 4096
    const SERVO_MAX_LEFT_ARM = 350;  // Max pulse length out of 4096 POSITION HAUTE 
    const SLEEP = 1000; // milliseconds between instructions   

    if (entityCommand == 'up') {
        client.publish("im/event/rpiheart/pwmhat/" + CHANNEL_LEFT_ARM, JSON.stringify({ pulse: SERVO_MAX_LEFT_ARM }));
    } else if (entityCommand == 'down') {
        client.publish("im/event/rpiheart/pwmhat/" + CHANNEL_LEFT_ARM, JSON.stringify({ pulse: SERVO_MIN_LEFT_ARM }));
    } else {
        //##DEFAULT move
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

    if (entityCommand == 'up') {
        client.publish("im/event/rpiheart/pwmhat/" + CHANNEL_RIGHT_ARM, JSON.stringify({ pulse: SERVO_MAX_RIGHT_ARM }));
    } else if (entityCommand == 'down') {
        client.publish("im/event/rpiheart/pwmhat/" + CHANNEL_RIGHT_ARM, JSON.stringify({ pulse: SERVO_MIN_RIGHT_ARM }));
    } else {
        //##DEFAULT move
        //the instructions is ended afer 1 secondes
        var cadence = Rx.Observable.timer(0, SLEEP);
        var moves = Rx.Observable.from([SERVO_MIN_RIGHT_ARM, SERVO_MIDDLE_RIGHT_ARM, SERVO_MAX_RIGHT_ARM, SERVO_MIN_RIGHT_ARM]);
        Rx.Observable.zip(cadence, moves, (s1, s2) => s2).map((pulse) => JSON.stringify({ pulse: pulse }))
            .subscribe(function (pulseStrPlayload) {
                client.publish("im/event/rpiheart/pwmhat/" + CHANNEL_RIGHT_ARM, pulseStrPlayload);
            })
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

    //##DEFAULT move
    //the instructions is ended afer 1 secondes
    var cadence = Rx.Observable.timer(0, SLEEP);
    var moves = Rx.Observable.from([SERVO_MIDDLE_LEFT_HAND, SERVO_MAX_LEFT_HAND, SERVO_MIN_LEFT_HAND, SERVO_MIDDLE_LEFT_HAND]);
    Rx.Observable.zip(cadence, moves, (s1, s2) => s2).map((pulse) => JSON.stringify({ pulse: pulse }))
        .subscribe(function (pulseStrPlayload) {
            client.publish("im/event/rpiheart/pwmhat/" + CHANNEL_LEFT_HAND, pulseStrPlayload);
        })

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

    //##DEFAULT move
    //the instructions is ended afer 1 secondes
    var cadence = Rx.Observable.timer(0, SLEEP);
    var moves = Rx.Observable.from([SERVO_MIDDLE_RIGHT_HAND, SERVO_MAX_RIGHT_HAND, SERVO_MIN_RIGHT_HAND, SERVO_MIDDLE_RIGHT_HAND]);
    Rx.Observable.zip(cadence, moves, (s1, s2) => s2).map((pulse) => JSON.stringify({ pulse: pulse }))
        .subscribe(function (pulseStrPlayload) {
            client.publish("im/event/rpiheart/pwmhat/" + CHANNEL_RIGHT_HAND, pulseStrPlayload);
        })

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

    if (entityCommand == 'facetrackmove') {
        //    /im/command/head/facetrackstart
        //          {origin:'camera',face:'base64faceimage',absPosition:%}
        //     /im/command/head/facetrackmove
        //          {origin:'camera',absPosition:%}
        //      /im/command/head/facetrackend
        //          {origin:'camera'}
        const range = 2.0;
        const angle = (inPlayLoad.absPosition / 100 * range) - (range / 2); //0-2 -> -1 - 1 or  //0-3 -> 1,5 -> 0,9
        const headPosition = (Math.tanh(angle) + 1) / 2; // +-0,76  -> 0,12 to 0,87
        let currentPulse = SERVO_MIN_HEAD + headPosition * (SERVO_MAX_HEAD - SERVO_MIN_HEAD);
        //let currentPulse = SERVO_MIN_HEAD + inPlayLoad.absPosition * (SERVO_MAX_HEAD - SERVO_MIN_HEAD) / 100;
        let pulseStrPlayload = JSON.stringify({ pulse: currentPulse });
        client.publish("im/event/rpiheart/pwmhat/" + CHANNEL_HEAD, pulseStrPlayload);
    } else if (entityCommand == 'reset') {
        client.publish("im/event/rpiheart/pwmhat/" + CHANNEL_HEAD, JSON.stringify({ pulse: SERVO_MIDDLE_HEAD }));
    } else {
        //##DEFAULT move
        //the instructions is ended afer 1 secondes
        var cadence = Rx.Observable.timer(0, SLEEP);
        var moves = Rx.Observable.from([SERVO_MIDDLE_HEAD, SERVO_MAX_HEAD, SERVO_MIN_HEAD, SERVO_MIDDLE_HEAD]);
        Rx.Observable.zip(cadence, moves, (s1, s2) => s2).map((pulse) => JSON.stringify({ pulse: pulse }))
            .subscribe(function (pulseStrPlayload) {
                client.publish("im/event/rpiheart/pwmhat/" + CHANNEL_HEAD, pulseStrPlayload);
            })
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
        let pulse = PWM_MAX;
        client.publish("im/event/rpiheart/pwmhat/" + LED_RED_CHANNEL, JSON.stringify({ pulse: 300 }));
        client.publish("im/event/rpiheart/pwmhat/" + LED_GREEN_CHANNEL, JSON.stringify({ pulse: 300 }));
        client.publish("im/event/rpiheart/pwmhat/" + LED_BLUE_CHANNEL, JSON.stringify({ pulse: 3000 }));
    } else if (entityCommand == 'off') {
        let pulse = PWM_MIN;
        client.publish("im/event/rpiheart/pwmhat/" + LED_RED_CHANNEL, JSON.stringify({ pulse: pulse }));
        client.publish("im/event/rpiheart/pwmhat/" + LED_GREEN_CHANNEL, JSON.stringify({ pulse: pulse }));
        client.publish("im/event/rpiheart/pwmhat/" + LED_BLUE_CHANNEL, JSON.stringify({ pulse: pulse }));
    } else if (entityCommand == 'color') {
        let a = parseInt(inPlayLoad.rgba.substr(6, 2), 16) / 256;
        let r = Math.round(parseInt(inPlayLoad.rgba.substr(0, 2), 16) / 256 * 4096 * a);
        let g = Math.round(parseInt(inPlayLoad.rgba.substr(2, 2), 16) / 256 * 4096 * a);
        let b = Math.round(parseInt(inPlayLoad.rgba.substr(4, 2), 16) / 256 * 4096 * a);
        client.publish("im/event/rpiheart/pwmhat/" + LED_RED_CHANNEL, JSON.stringify({ pulse: r }));
        client.publish("im/event/rpiheart/pwmhat/" + LED_GREEN_CHANNEL, JSON.stringify({ pulse: g }));
        client.publish("im/event/rpiheart/pwmhat/" + LED_BLUE_CHANNEL, JSON.stringify({ pulse: b }));
    } else {
        //default on - sleep 300  - off
        client.publish("im/command/eyes/on", JSON.stringify({ origin: 'im-brain' }));
        setTimeout(function () {
            client.publish("im/command/eyes/off", JSON.stringify({ origin: 'im-brain' }));
        }, 200)
    }
}

/**
 * helemt entity domain
 * execute validation and consequential logic
 */
entities.helmetEntity = function (client, entityCommand, inPlayLoad) {
    //HITEC HS-5645MG 50Hz LEFT ARM
    const CHANNEL_HELMET = 6;
    const SERVO_MIN_HELMT = 170;//Min pulse length out of 4096 POSITION BASSE
    const SERVO_MAX_HELMET = 325;// Max pulse length out of 4096 POSITION HAUTE
    const SLEEP = 4000; // milliseconds between instructions   

    if (entityCommand == 'open') {
        client.publish("im/event/rpiheart/pwmhat/" + CHANNEL_HELMET, JSON.stringify({ pulse: SERVO_MAX_HELMET }));
    } else if (entityCommand == 'close') {
        client.publish("im/event/rpiheart/pwmhat/" + CHANNEL_HELMET, JSON.stringify({ pulse: SERVO_MIN_HELMT }));
    } else {
        //##DEFAULT move
        //the instructions is ended afer 1 secondes
        var cadence = Rx.Observable.timer(0, SLEEP);
        var moves = Rx.Observable.from([SERVO_MAX_HELMET, SERVO_MIN_HELMT]);
        Rx.Observable.zip(cadence, moves, (s1, s2) => s2).map((pulse) => JSON.stringify({ pulse: pulse }))
            .subscribe(function (pulseStrPlayload) {
                client.publish("im/event/rpiheart/pwmhat/" + CHANNEL_HELMET, pulseStrPlayload);
            })
    }
}

/**
* im aggregate domain
* execute validation and consequential logic
*/
entities.energyEntity = function (client, entityCommand, inPlayLoad) {
    const DEFAULT_SPEED = 0.02;
    const DEFAULT_REPEAT = 20;
    const DEFAULT_RED = 34;
    const DEFAULT_GREEN = 34;
    const DEFAULT_BLUE = 255;

    let evtPayLoad = inPlayLoad;
    if (inPlayLoad.rgb) {
        evtPayLoad.red = parseInt(inPlayLoad.rgb.substr(0, 2), 16)
        evtPayLoad.green = parseInt(inPlayLoad.rgb.substr(2, 2), 16)
        evtPayLoad.blue = parseInt(inPlayLoad.rgb.substr(4, 2), 16)
    } else {
        evtPayLoad.red = DEFAULT_RED;
        evtPayLoad.green = DEFAULT_GREEN;
        evtPayLoad.blue = DEFAULT_BLUE;
    }
    if (inPlayLoad.speed) {
        evtPayLoad.speed = inPlayLoad.speed / 1000.0;
    } else {
        evtPayLoad.speed = DEFAULT_SPEED;
    }
    if (!evtPayLoad.repeat) {
        evtPayLoad.repeat = DEFAULT_REPEAT;
    }
    delete evtPayLoad.origin;
    delete evtPayLoad.rgb;

    if (entityCommand == 'on') {
        client.publish("im/event/rpiheart/neopixel/on", JSON.stringify(evtPayLoad));
    } else if (entityCommand == 'off') {
        client.publish("im/event/rpiheart/neopixel/off", JSON.stringify(evtPayLoad));
    } else if (entityCommand == 'beat') {
        client.publish("im/event/rpiheart/neopixel/beat", JSON.stringify(evtPayLoad));
    } else if (entityCommand == 'chase') {
        client.publish("im/event/rpiheart/neopixel/chase", JSON.stringify(evtPayLoad));
    } else {
        client.publish("im/event/rpiheart/neopixel/beat", JSON.stringify(evtPayLoad));
    }
}


/**
* im aggregate domain
* execute validation and consequential logic
*/
entities.imEntity = function (client, entityCommand, inPlayLoad) {

    if (entityCommand == 'clients') {
        //update internal state
        entities.imState.brokerClients = inPlayLoad.clients;
        client.publish("im/event/rpiheart/status", JSON.stringify(entities.imState), { retain: true });
    }
    if (entityCommand == 'reset') {
        client.publish("im/event/rpiheart/pwmhat/reset", JSON.stringify({ origin: 'im-brain' }));
        client.publish("im/command/energy/off", JSON.stringify({ origin: 'im-brain' }));
        client.publish("im/command/eyes/off", JSON.stringify({ origin: 'im-brain' }));
        client.publish("im/command/helmet/close", JSON.stringify({ origin: 'im-brain' }));
        client.publish("im/command/head/reset", JSON.stringify({ origin: 'im-brain' }));
    }
    if (entityCommand == 'color') {
        client.publish("im/command/eyes/color", JSON.stringify({ origin: 'im-brain', rgba: inPlayLoad.rgba }));
        client.publish("im/command/energy/on", JSON.stringify({ origin: 'im-brain', rgb: inPlayLoad.rgba.substr(0, 6) }));
    }
}
module.exports = entities;
