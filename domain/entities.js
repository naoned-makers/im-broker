
let Rx = require('rxjs/Rx');

var entities = {};
/**
 * leftarm entity domain
 * execute validation and consequential logic
 */
entities.leftarmEntity = function (client, entityCommand, playLoad) {
    //HITEC HS-5645MG 50Hz LEFT ARM
    const CHANNEL_LEFT_ARM = 0;
    const SERVO_MIN_LEFT_ARM = '170';  // Min pulse length out of 4096 POSITION BASSE
    const SERVO_MIDDLE_LEFT_ARM = '280';  // Middle pulse length out of 4096
    const SERVO_MAX_LEFT_ARM = '350';  // Max pulse length out of 4096 POSITION HAUTE 
    const SLEEP = 1000; // milliseconds between instructions   
    if (entityCommand == 'move') {

        //the instructions is ended afer 1 secondes
        var cadence = Rx.Observable.timer(0, SLEEP);
        var moves = Rx.Observable.from([SERVO_MIN_LEFT_ARM, SERVO_MIDDLE_LEFT_ARM, SERVO_MAX_LEFT_ARM, SERVO_MIN_LEFT_ARM]);
        Rx.Observable.zip(cadence, moves, (s1, s2) => s2)
            .subscribe(function (pwmpulse) {
                client.publish("im/rpiheart/pwmbreakout/" + CHANNEL_LEFT_ARM, pwmpulse);
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
    const SERVO_MIN_RIGHT_ARM = '480' ; // Min pulse length out of 4096 POSITION BASSE
    const SERVO_MIDDLE_RIGHT_ARM = '350';  // Middle pulse length out of 4096
    const SERVO_MAX_RIGHT_ARM = '290';  // Max pulse length out of 4096 POSITION HAUTE
    const SLEEP = 1000; // milliseconds between instructions   
    if (entityCommand == 'move') {

        //the instructions is ended afer 1 secondes
        var cadence = Rx.Observable.timer(0, SLEEP);
        var moves = Rx.Observable.from([SERVO_MIN_RIGHT_ARM, SERVO_MIDDLE_RIGHT_ARM, SERVO_MAX_RIGHT_ARM, SERVO_MIN_RIGHT_ARM]);
        Rx.Observable.zip(cadence, moves, (s1, s2) => s2)
            .subscribe(function (pwmpulse) {
                client.publish("im/rpiheart/pwmbreakout/" + CHANNEL_RIGHT_ARM, pwmpulse);
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
entities.headEntity = function (client, entityCommand, playLoad) {
    //HITEC HS-5645MG 50Hz LEFT ARM
    const CHANNEL_HEAD = 2;
    const SERVO_MIN_HEAD = '165';//Min pulse length out of 4096 POSITION BASSE
    const SERVO_MIDDLE_HEAD = '305';// Middle pulse length out of 4096
    const SERVO_MAX_HEAD = '450';// Max pulse length out of 4096 POSITION HAUTE
    const SLEEP = 1000; // milliseconds between instructions   

    if (entityCommand == 'move') {
        //the instructions is ended afer 1 secondes
        var cadence = Rx.Observable.timer(0, SLEEP);
        var moves = Rx.Observable.from([SERVO_MIDDLE_HEAD, SERVO_MAX_HEAD, SERVO_MIN_HEAD, SERVO_MIDDLE_HEAD]);
        Rx.Observable.zip(cadence, moves, (s1, s2) => s2)
            .subscribe(function (pwmpulse) {
                client.publish("im/rpiheart/pwmbreakout/" + CHANNEL_HEAD, pwmpulse);
            })
        /*
        client.publish("im/rpiheart/pwmbreakout/" + CHANNEL_HEAD, SERVO_MIDDLE_HEAD);
        console.log("   Tête à moitié tournée à droite");
        //time.sleep(sleep)
        client.publish("im/rpiheart/pwmbreakout/" + CHANNEL_HEAD, SERVO_MAX_HEAD);
        console.log("   Tête complétement tournée à droite");
        //time.sleep(sleep)
        client.publish("im/rpiheart/pwmbreakout/" + CHANNEL_HEAD, SERVO_MIN_HEAD);
        console.log("   Tête à moitié tournée à gauche");
        //time.sleep(sleep)
        client.publish("im/rpiheart/pwmbreakout/" + CHANNEL_HEAD, SERVO_MIDDLE_HEAD);
        console.log("   Tête complétement tournée à gauche");
        //time.sleep(sleep)
        */
    }
}
/**
* lefthand entity domain
* execute validation and consequential logic
*/
entities.lefthandEntity = function (client, entityCommand, playLoad) {
    // HITEC HS-5645MG 50Hz LEFT ARM
    const CHANNEL_LEFT_HAND = 5
    const SERVO_MIN_LEFT_HAND = '160'  // Min pulse length out of 4096 POSITION BASSE
    const SERVO_MIDDLE_LEFT_HAND = '240'  // Middle pulse length out of 4096
    const SERVO_MAX_LEFT_HAND = '350'  // Max pulse length out of 4096 POSITION HAUTE
    const SLEEP = 1000; // milliseconds between instructions   
    if (entityCommand == 'move') {
        //the instructions is ended afer 1 secondes
        var cadence = Rx.Observable.timer(0, SLEEP);
        var moves = Rx.Observable.from([SERVO_MIDDLE_LEFT_HAND, SERVO_MAX_LEFT_HAND, SERVO_MIN_LEFT_HAND, SERVO_MIDDLE_LEFT_HAND]);
        Rx.Observable.zip(cadence, moves, (s1, s2) => s2)
            .subscribe(function (pwmpulse) {
                client.publish("im/rpiheart/pwmbreakout/" + CHANNEL_LEFT_HAND, pwmpulse);
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
* righthand entity domain
* execute validation and consequential logic
*/
entities.righthandEntity = function (client, entityCommand, playLoad) {
    // HITEC HS-5645MG 50Hz LEFT ARM
    const CHANNEL_RIGHT_HAND = 4
    const SERVO_MIN_RIGHT_HAND = '240'  // Min pulse length out of 4096 POSITION BASSE
    const SERVO_MIDDLE_RIGHT_HAND = '360'  // Middle pulse length out of 4096
    const SERVO_MAX_RIGHT_HAND = '440'  // Max pulse length out of 4096 POSITION HAUTE
    const SLEEP = 1000; // milliseconds between instructions   
    if (entityCommand == 'move') {
        //the instructions is ended afer 1 secondes
        var cadence = Rx.Observable.timer(0, SLEEP);
        var moves = Rx.Observable.from([SERVO_MIDDLE_RIGHT_HAND, SERVO_MAX_RIGHT_HAND,SERVO_MIN_RIGHT_HAND, SERVO_MIDDLE_RIGHT_HAND]);
        Rx.Observable.zip(cadence, moves, (s1, s2) => s2)
            .subscribe(function (pwmpulse) {
                client.publish("im/rpiheart/pwmbreakout/" + CHANNEL_RIGHT_HAND, pwmpulse);
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
module.exports = entities;