"use strict";

let Rx = require('rxjs/Rx');
let stat = require('./stat.js');
let disk = require('diskusage');
let {
    types,
    onSnapshot,
    onPatch
} = require("mobx-state-tree");

/**********************************
 ****** MODEL *********************
 ***********************************/
const ImAction = types.model("ImAction", {
    key: types.identifier(),
    label: types.string,
}).actions(self => ({
    use() {
        //self.busy = true;
    }
}))

const ImPart = types.model("ImPart", {
    key: types.identifier(),
    label: types.string,
    parts: types.maybe(types.map(types.late(() => ImPart))),
    command: types.maybe(types.string),
    lastActivity: types.optional(types.Date, () => new Date()),

    pwmChannel: types.maybe(types.number), //TODO extract in inheritance model ImpPmwPart
    pwmCurrent: types.maybe(types.number), //TODO extract in inheritance model ImpPmwPart
    pwmSteps: types.maybe(types.array(types.number)),//TODO extract in inheritance model ImpPmwPart
    pwmStepsIndex: types.maybe(types.number)//TODO extract in inheritance model ImpPmwPart
}).actions(self => ({
    init(pClient){
        entities.startPeriodic(pClient);
    },
    do(pClient,command, payLoad) {
        self.command = command;
        self.lastActivity = new Date();
        entities[self.key + 'Entity'](pClient, command, payLoad);
    },
    changePwmTo(pClient,currentPulse) {
        self.pwmCurrent = currentPulse;
        pClient.publish("im/event/rpiheart/pwmhat/" + self.pwmChannel, JSON.stringify({
            pulse: currentPulse
        }));
    },
    nextPwmStep(pClient){
        if(self.pwmStepsIndex == undefined){
            self.pwmStepsIndex=0;
        }else if(self.pwmStepsIndex+1 < self.pwmSteps.length){
            self.pwmStepsIndex = self.pwmStepsIndex +1;
        }else{
            self.pwmStepsIndex=0; 
        }
        self.changePwmTo(pClient,self.pwmSteps[self.pwmStepsIndex]) ;
    },
    free() {
        self.command = 'none';
    },
    isFree() {
        return self.command == 'none';
    },
    maybeInactive() {
        return (self.key.indexOf('arm') > -1 || self.key.indexOf('hand') > -1);
    },
    childFree(partKey, command) {
        self.parts.get(partKey).free();
    },
    addChild(part) {
        if (!self.parts) {
            self.parts = {};
        }
        self.parts.put(part);
    }
})).views(self => {
    return {
        get lastBodyActivity() {
            //Last arm or hand activity
            return self.parts.values().filter(p => p.maybeInactive()).map(p => p.lastActivity).reduce(function (reduced, currentVal) {
                //take the oldest
                return (reduced > currentVal) ? currentVal : reduced;
            }, new Date());
        }
    };
})

let cancelPromise = new Promise((resolve, reject) => {
    // réaliser une tâche asynchrone et appeler : 

    // resolve(uneValeur); // si la promesse est tenue
    // ou 
    // reject("raison d'echec"); // si elle est rompue
});

/**********************************
 ****** MODEL *********************
 ***********************************/
var im = ImPart.create({
    key: 'im',
    label: 'Im aggregate'
});
const CHANNEL_HEAD = 2;
const SERVO_MIN_HEAD = 165; //Min pulse length out of 4096 POSITION BASSE
const SERVO_FIRST_QUARTER_HEAD = 235;
const SERVO_MIDDLE_HEAD = 305; // Middle pulse length out of 4096
const SERVO_THIRD_QUARTER_HEAD = 375;
const SERVO_MAX_HEAD = 450; // Max pulse length out of 4096 POSITION HAUTE
let head = ImPart.create({
    key: 'head',
    label: 'Im head',
    pwmChannel: CHANNEL_HEAD,
    pwmSteps:[SERVO_MIN_HEAD,SERVO_FIRST_QUARTER_HEAD,SERVO_MIDDLE_HEAD,SERVO_THIRD_QUARTER_HEAD,SERVO_MAX_HEAD,SERVO_THIRD_QUARTER_HEAD,SERVO_MIDDLE_HEAD,SERVO_FIRST_QUARTER_HEAD],
    pwmCurrent:SERVO_MIDDLE_HEAD//assume we start as this
});
const CHANNEL_HELMET = 7;
const SERVO_MIN_HELMET = 170; //Min pulse length out of 4096 POSITION BASSE
const SERVO_MAX_HELMET = 325; // Max pulse length out of 4096 POSITION HAUTE
let helmet = ImPart.create({
    key: 'helmet',
    label: 'Im helmet',
    command:'none',
    pwmChannel: CHANNEL_HELMET,
    pwmSteps:[SERVO_MIN_HELMET,SERVO_MAX_HELMET],
    pwmCurrent:SERVO_MIN_HELMET//assume we start as this
});
const CHANNEL_LEFT_ARM = 0;
const SERVO_MIN_LEFT_ARM = 165; // Min pulse length out of 4096 POSITION BASSE
const SERVO_MIDDLE_LEFT_ARM = 280; // Middle pulse length out of 4096
const SERVO_MAX_LEFT_ARM = 350; // Max pulse length out of 4096 POSITION HAUTE 
let leftarm = ImPart.create({
    key: 'leftarm',
    label: 'Im leftarm',
    pwmChannel: CHANNEL_LEFT_ARM,
    pwmSteps:[SERVO_MIN_LEFT_ARM,SERVO_MIDDLE_LEFT_ARM,SERVO_MAX_LEFT_ARM,SERVO_MIDDLE_LEFT_ARM],
    pwmCurrent:SERVO_MIN_LEFT_ARM//assume we start as this
});
const CHANNEL_RIGHT_ARM = 1
const SERVO_MIN_RIGHT_ARM = 480; // Min pulse length out of 4096 POSITION BASSE
const SERVO_MIDDLE_RIGHT_ARM = 350; // Middle pulse length out of 4096
const SERVO_MAX_RIGHT_ARM = 290; // Max pulse length out of 4096 POSITION HAUTE
let rightarm = ImPart.create({
    key: 'rightarm',
    label: 'Im rightarm',
    pwmChannel: CHANNEL_RIGHT_ARM,
    pwmSteps:[SERVO_MIN_RIGHT_ARM,SERVO_MIDDLE_RIGHT_ARM,SERVO_MAX_RIGHT_ARM,SERVO_MIDDLE_RIGHT_ARM],
    pwmCurrent:SERVO_MIN_RIGHT_ARM//assume we start as this
});
const CHANNEL_LEFT_HAND = 5
const SERVO_MIN_LEFT_HAND = 160 // Min pulse length out of 4096 POSITION BASSE
const SERVO_MIDDLE_LEFT_HAND = 240 // Middle pulse length out of 4096
const SERVO_MAX_LEFT_HAND = 350 // Max pulse length out of 4096 POSITION HAUTE
let lefthand = ImPart.create({
    key: 'lefthand',
    label: 'Im lefthand',
    pwmChannel: CHANNEL_LEFT_HAND,
    pwmSteps:[SERVO_MIN_LEFT_HAND,SERVO_MIDDLE_LEFT_HAND,SERVO_MAX_LEFT_HAND,SERVO_MIDDLE_LEFT_HAND],
    pwmCurrent:SERVO_MIDDLE_LEFT_HAND//assume we start as this
})
const CHANNEL_RIGHT_HAND = 4
const SERVO_MIN_RIGHT_HAND = 240 // Min pulse length out of 4096 POSITION BASSE
const SERVO_MIDDLE_RIGHT_HAND = 360 // Middle pulse length out of 4096
const SERVO_MAX_RIGHT_HAND = 440 // Max pulse length out of 4096 POSITION HAUTE
let righthand = ImPart.create({
    key: 'righthand',
    label: 'Im righthand',
    pwmChannel: CHANNEL_RIGHT_HAND,
    pwmSteps:[SERVO_MIN_RIGHT_HAND,SERVO_MIDDLE_RIGHT_HAND,SERVO_MAX_RIGHT_HAND,SERVO_MIDDLE_RIGHT_HAND],
    pwmCurrent:SERVO_MIDDLE_RIGHT_HAND//assume we start as this
})
let eyes = ImPart.create({
    key: 'eyes',
    label: 'Im eyes'
})
let energy = ImPart.create({
    key: 'energy',
    label: 'Im energy'
})


im.addChild(head);
im.addChild(helmet);
im.addChild(leftarm);
im.addChild(rightarm);
im.addChild(lefthand);
im.addChild(righthand);
im.addChild(eyes);
im.addChild(energy);

// listen to new snapshots
onSnapshot(im, (snapshot) => {
    //console.dir(snapshot)
})
onPatch(im, patch => {
    //console.dir("Got change: " + JSON.stringify(patch));
})

let entities = {
    startPeriodic: function (client) {
        const SLEEP = 1000; // milliseconds between instruction
        //cpu,mem,disk periodic trigger
        Rx.Observable.timer(0, 5000).switchMap(() => Rx.Observable.fromPromise(new Promise((resolve, reject) => {
            stat.cpuUsage(function (err, cpuUsageVal) {
                if (!err) {
                    disk.check(".", function (err, info) {
                        if (err) {
                            reject(err);
                        } else {
                            // System states.
                            resolve({
                                memory: stat.memory,
                                cpuUsage: cpuUsageVal,
                                disk: info
                            });
                        }
                    });
                } else {
                    reject(err);
                }
            })
        })), (outerValue, innerValue) => innerValue).subscribe((payload) => {
            client.publish("im/event/rpiheart/usage", JSON.stringify(payload));
        });
        /*INACTIVITY_PERIOD trigger
        const INACTIVITY_PERIOD = 1000 * 60 * 2; //Do nothing more than 2 minutes
        const INACTIVITY_SLEEP = 2000; // milliseconds between part move
        Rx.Observable.interval(5000).map(t => im.lastBodyActivity).filter(last => (new Date() - last) > INACTIVITY_PERIOD).subscribe((payload) => {
            var cadence = Rx.Observable.timer(0, INACTIVITY_SLEEP);
            var moves = Rx.Observable.from([leftarm, rightarm, righthand, lefthand]);
            Rx.Observable.zip(cadence, moves, (s1, s2) => s2).subscribe(function (imPart) {
                client.publish("im/command/" + imPart.key + "/move", JSON.stringify({
                    origin: 'im-inactivity'
                }));
            });

        });*/
        console.log("Periodic task started");
    }
};

/**
 * leftarm entity domain
 * execute validation and consequential logic
 */
entities.leftarmEntity = function (client, entityCommand, inPayLoad) {
    if (entityCommand == 'up' && helmet.isFree()) {
        leftarm.changePwmTo(client,SERVO_MAX_LEFT_ARM);
        leftarm.free();
    } else if (entityCommand == 'down') {
        leftarm.changePwmTo(client,SERVO_MIN_LEFT_ARM);
        leftarm.free();
    } else if (entityCommand == 'next' && helmet.isFree()) {
        leftarm.nextPwmStep(client)
        leftarm.free();
    } else if (entityCommand == 'next' && !helmet.isFree()) {
        client.publish("im/command/helmet/close", JSON.stringify({
            origin: 'im-safe'
        }));
        setTimeout(function () {
            client.publish("im/command/leftarm/next" , JSON.stringify({
                origin: 'im-brain'
            }));
        }, 500);
    } else if (entityCommand == 'set' && helmet.isFree()) {
        let currentPulse = SERVO_MIN_LEFT_ARM + inPayLoad.absPosition/100 * (SERVO_MAX_LEFT_ARM - SERVO_MIN_LEFT_ARM);
        leftarm.changePwmTo(client,currentPulse)
        leftarm.free();
    } else if (helmet.isFree()) {
        //##DEFAULT move
        //the instructions is ended afer 1 secondes
        const SLEEP = 1000; // milliseconds between instructions  
        let cadence = Rx.Observable.timer(0, SLEEP).takeUntil(Rx.Observable.timer(SLEEP * 5));
        let moves = Rx.Observable.from([SERVO_MIN_LEFT_ARM, SERVO_MIDDLE_LEFT_ARM, SERVO_MAX_LEFT_ARM, SERVO_MIN_LEFT_ARM]);
        Rx.Observable.zip(cadence, moves, (s1, s2) => s2).subscribe(function (pulse) {
                if (helmet.isFree()) {
                    leftarm.changePwmTo(client,pulse);
                }
            }, (err) => {},
            function () {
                console.log("leftarm free" + leftarm.command);
                leftarm.free();
            })
    }
}
/**
 * rightarm entity domain
 * execute validation and consequential logic
 */
entities.rightarmEntity = function (client, entityCommand, inPayLoad) {
    if (entityCommand == 'up' && helmet.isFree()) {
        rightarm.changePwmTo(client,SERVO_MAX_RIGHT_ARM);
        rightarm.free();
    } else if (entityCommand == 'down') {
        rightarm.changePwmTo(client,SERVO_MIN_RIGHT_ARM);
        rightarm.free();
    } else if (entityCommand == 'next' && helmet.isFree()) {
        rightarm.nextPwmStep(client);
        rightarm.free();
    } else if (entityCommand == 'next' && !helmet.isFree()) {
        client.publish("im/command/helmet/close", JSON.stringify({
            origin: 'im-safe'
        }));
        setTimeout(function () {
            client.publish("im/command/rightarm/next" , JSON.stringify({
                origin: 'im-brain'
            }));
        }, 500);        
    } else if (entityCommand == 'set' && helmet.isFree()) {
        let currentPulse = SERVO_MIN_RIGHT_ARM + inPayLoad.absPosition/100 * (SERVO_MAX_RIGHT_ARM - SERVO_MIN_RIGHT_ARM);
        rightarm.changePwmTo(client,currentPulse)
        rightarm.free();
    } else if (helmet.isFree()) {
        //##DEFAULT move
        //the instructions is ended afer 1 secondes
        const SLEEP = 1000; // milliseconds between instructions  
        const stop$ = Rx.Observable.merge(Rx.Observable.fromPromise(cancelPromise), Rx.Observable.timer(SLEEP * 5))
        let cadence = Rx.Observable.timer(0, SLEEP).takeUntil(stop$);
        let moves = Rx.Observable.from([SERVO_MIN_RIGHT_ARM, SERVO_MIDDLE_RIGHT_ARM, SERVO_MAX_RIGHT_ARM, SERVO_MIN_RIGHT_ARM]);
        Rx.Observable.zip(cadence, moves, (s1, s2) => s2).subscribe(function (pulse) {
                if (helmet.isFree()) {
                    rightarm.changePwmTo(client,pulse);
                }
            }, (err) => {},
            function () {
                console.log("right arm free" + rightarm.command);
                rightarm.free();
            })
    }

}
/**
 * lefthand entity domain
 * execute validation and consequential logic
 */
entities.lefthandEntity = function (client, entityCommand, inPayLoad) {

    if (entityCommand == 'next') {
        lefthand.nextPwmStep(client);
        lefthand.free();
    } else if (entityCommand == 'set') {
        let currentPulse = SERVO_MIN_LEFT_HAND + inPayLoad.absPosition/100 * (SERVO_MAX_LEFT_HAND - SERVO_MIN_LEFT_HAND);
        lefthand.changePwmTo(client,currentPulse)
        lefthand.free();
    } else {
        //##DEFAULT move
        //the instructions is ended afer 1 secondes
        const SLEEP = 1000; // milliseconds between instructions   
        let cadence = Rx.Observable.timer(0, SLEEP).takeUntil(Rx.Observable.timer(SLEEP * 5));
        let moves = Rx.Observable.from([SERVO_MIDDLE_LEFT_HAND, SERVO_MAX_LEFT_HAND, SERVO_MIN_LEFT_HAND, SERVO_MIDDLE_LEFT_HAND]);
        Rx.Observable.zip(cadence, moves, (s1, s2) => s2).subscribe(function (pulse) {
                lefthand.changePwmTo(client,pulse);
            }, (err) => {},
            function () {
                console.log("left hand free" + lefthand.command);
                lefthand.free();
            })
    }

}

/**
 * righthand entity domain
 * execute validation and consequential logic
 */
entities.righthandEntity = function (client, entityCommand, inPayLoad) {

    if (entityCommand == 'next') {
        righthand.nextPwmStep(client);
        righthand.free();
    } else if (entityCommand == 'set') {
        let currentPulse = SERVO_MIN_RIGHT_HAND + inPayLoad.absPosition/100 * (SERVO_MAX_RIGHT_HAND - SERVO_MIN_RIGHT_HAND);
        righthand.changePwmTo(client,currentPulse)
        righthand.free();
    } else {
        //##DEFAULT move
        //the instructions is ended afer 1 secondes
        const SLEEP = 1000; // milliseconds between instructions 
        let cadence = Rx.Observable.timer(0, SLEEP).takeUntil(Rx.Observable.timer(SLEEP * 5));
        let moves = Rx.Observable.from([SERVO_MIDDLE_RIGHT_HAND, SERVO_MAX_RIGHT_HAND, SERVO_MIN_RIGHT_HAND, SERVO_MIDDLE_RIGHT_HAND]);
        Rx.Observable.zip(cadence, moves, (s1, s2) => s2).subscribe(function (pulse) {
                righthand.changePwmTo(client,pulse);
            }, (err) => {},
            function () {
                console.log("left hand free" + righthand.command);
                righthand.free();
            })
    }
}

/**
 * head entity domain
 * execute validation and consequential logic
 */
entities.headEntity = function (client, entityCommand, inPayLoad) {
    if (entityCommand == 'facetrackmove') {
        //    /im/command/head/facetrackstart
        //          {origin:'camera',face:'base64faceimage',absPosition:%}
        //     /im/command/head/facetrackmove
        //          {origin:'camera',absPosition:%}
        //      /im/command/head/facetrackend
        //          {origin:'camera'}
        const range = 2.0;
        const angle = (inPayLoad.absPosition / 100 * range) - (range / 2); //0-2 -> -1 - 1 or  //0-3 -> 1,5 -> 0,9
        const headPosition = (Math.tanh(angle) + 1) / 2; // +-0,76  -> 0,12 to 0,87
        let currentPulse = SERVO_MIN_HEAD + headPosition * (SERVO_MAX_HEAD - SERVO_MIN_HEAD);
        head.changePwmTo(client,Math.round(currentPulse));
        head.free();
    } else if (entityCommand == 'facetrackstart') {
        console.log("Start face track \n" +inPayLoad.face);
        //head.nextPwmStep(client);
        head.free();
    } else if (entityCommand == 'next') {
        head.nextPwmStep(client);
        head.free();
    } else if (entityCommand == 'reset') {
        head.changePwmTo(client,SERVO_MIDDLE_HEAD);
        head.free();
    } else if (entityCommand == 'set') {
        let currentPulse = SERVO_MIN_HEAD + inPayLoad.absPosition/100 * (SERVO_MAX_HEAD - SERVO_MIN_HEAD);
        head.changePwmTo(client,currentPulse)
        head.free();
    } else {
        //##DEFAULT move
        //the instructions is ended afer 1 secondes
        const SLEEP = 1000; // milliseconds between instructions   
        let cadence = Rx.Observable.timer(0, SLEEP).takeUntil(Rx.Observable.timer(SLEEP * 6));
        let moves = Rx.Observable.from([SERVO_MIDDLE_HEAD, SERVO_MAX_HEAD,SERVO_MIDDLE_HEAD, SERVO_MIN_HEAD, SERVO_MIDDLE_HEAD]);
        Rx.Observable.zip(cadence, moves, (s1, s2) => s2).subscribe(function (pulse) {
                head.changePwmTo(client,pulse);
            }, (err) => {},
            function () {
                console.log("head free" + head.command);
                head.free();
            })


    }
}


/**
 * helemt entity domain
 * execute validation and consequential logic
 */
entities.helmetEntity = function (client, entityCommand, inPayLoad) {
    if (leftarm.pwmCurrent == SERVO_MAX_LEFT_ARM || rightarm.pwmCurrent == SERVO_MAX_RIGHT_ARM) {
        client.publish("im/command/leftarm/down", JSON.stringify({
            origin: 'im-safe'
        }));
        client.publish("im/command/rightarm/down", JSON.stringify({
            origin: 'im-safe'
        }));
        console.info("down arm before")
        setTimeout(function () {
            client.publish("im/command/helmet" + (entityCommand ? '/' + entityCommand : ''), JSON.stringify({
                origin: 'im-brain'
            }));
        }, 500);
        //wait to down arm before opening the helmet
        return;
    }

    if (entityCommand == 'open') {
        helmet.changePwmTo(client,SERVO_MAX_HELMET);
    } else if (entityCommand == 'close') {
        helmet.changePwmTo(client,SERVO_MIN_HELMET);
        helmet.free();
    } else if (entityCommand == 'next') {
        helmet.nextPwmStep(client);
        if(helmet.pwmCurrent==SERVO_MIN_HELMET){
            helmet.free();
        }
    } else if (entityCommand == 'set') {
        let currentPulse = SERVO_MIN_HELMET + inPayLoad.absPosition/100 * (SERVO_MAX_HELMET - SERVO_MIN_HELMET);
        helmet.changePwmTo(client,currentPulse)
        helmet.free();
    } else {
        //##DEFAULT move
        //the instructions is ended afer 4 secondes
        const SLEEP = 4000; // milliseconds between instructions
        var cadence = Rx.Observable.timer(0, SLEEP).takeUntil(Rx.Observable.timer(SLEEP * 2 + 1000));
        var moves = Rx.Observable.from([SERVO_MAX_HELMET, SERVO_MIN_HELMET]);
        Rx.Observable.zip(cadence, moves, (s1, s2) => s2).subscribe(function (pulse) {
                helmet.changePwmTo(client,pulse);
            }, (err) => {},
            function () {
                console.log("helmet free" + helmet.command);
                helmet.free();
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
    const PWM_MIN = 0; // Min pulse length out of 4096 POSITION BASSE
    const PWM_MAX = 4096; // Max pulse length out of 4096 POSITION HAUTE
    if (entityCommand == 'on') {
        let pulse = PWM_MAX;
        client.publish("im/event/rpiheart/pwmhat/" + LED_RED_CHANNEL, JSON.stringify({
            pulse: 300
        }));
        client.publish("im/event/rpiheart/pwmhat/" + LED_GREEN_CHANNEL, JSON.stringify({
            pulse: 300
        }));
        client.publish("im/event/rpiheart/pwmhat/" + LED_BLUE_CHANNEL, JSON.stringify({
            pulse: 3000
        }));
    } else if (entityCommand == 'off') {
        let pulse = PWM_MIN;
        client.publish("im/event/rpiheart/pwmhat/" + LED_RED_CHANNEL, JSON.stringify({
            pulse: pulse
        }));
        client.publish("im/event/rpiheart/pwmhat/" + LED_GREEN_CHANNEL, JSON.stringify({
            pulse: pulse
        }));
        client.publish("im/event/rpiheart/pwmhat/" + LED_BLUE_CHANNEL, JSON.stringify({
            pulse: pulse
        }));
    } else if (entityCommand == 'color') {
        let a = parseInt(inPlayLoad.rgba.substr(6, 2), 16) / 256;
        let r = Math.round(parseInt(inPlayLoad.rgba.substr(0, 2), 16) / 256 * 4096 * a);
        let g = Math.round(parseInt(inPlayLoad.rgba.substr(2, 2), 16) / 256 * 4096 * a);
        let b = Math.round(parseInt(inPlayLoad.rgba.substr(4, 2), 16) / 256 * 4096 * a);
        client.publish("im/event/rpiheart/pwmhat/" + LED_RED_CHANNEL, JSON.stringify({
            pulse: r
        }));
        client.publish("im/event/rpiheart/pwmhat/" + LED_GREEN_CHANNEL, JSON.stringify({
            pulse: g
        }));
        client.publish("im/event/rpiheart/pwmhat/" + LED_BLUE_CHANNEL, JSON.stringify({
            pulse: b
        }));
    } else {
        //default on - sleep 300  - off
        let pulse = PWM_MAX;
        client.publish("im/event/rpiheart/pwmhat/" + LED_RED_CHANNEL, JSON.stringify({
            pulse: 300
        }));
        client.publish("im/event/rpiheart/pwmhat/" + LED_GREEN_CHANNEL, JSON.stringify({
            pulse: 300
        }));
        client.publish("im/event/rpiheart/pwmhat/" + LED_BLUE_CHANNEL, JSON.stringify({
            pulse: 3000
        }));
        setTimeout(function () {
            let pulse = PWM_MIN;
            client.publish("im/event/rpiheart/pwmhat/" + LED_RED_CHANNEL, JSON.stringify({
                pulse: pulse
            }));
            client.publish("im/event/rpiheart/pwmhat/" + LED_GREEN_CHANNEL, JSON.stringify({
                pulse: pulse
            }));
            client.publish("im/event/rpiheart/pwmhat/" + LED_BLUE_CHANNEL, JSON.stringify({
                pulse: pulse
            }));
        }, 200)
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
    if (entityCommand == 'reset') {
        client.publish("im/event/rpiheart/pwmhat/reset", JSON.stringify({
            origin: 'im-brain'
        }));
        client.publish("im/command/energy/off", JSON.stringify({
            origin: 'im-brain'
        }));
        client.publish("im/command/eyes/off", JSON.stringify({
            origin: 'im-brain'
        }));
        client.publish("im/command/helmet/close", JSON.stringify({
            origin: 'im-brain'
        }));
        client.publish("im/command/head/reset", JSON.stringify({
            origin: 'im-brain'
        }));
    }
    if (entityCommand == 'color') {
        client.publish("im/command/eyes/color", JSON.stringify({
            origin: 'im-brain',
            rgba: inPlayLoad.rgba
        }));
        client.publish("im/command/energy/on", JSON.stringify({
            origin: 'im-brain',
            rgb: inPlayLoad.rgba.substr(0, 6)
        }));
    }
}
module.exports = im;