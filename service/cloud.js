let mqtt = require('mqtt');

/**
 * A internet gateway that synchronize one way between an internet firebase realtime database and local mqtt broker
 *      firebase path  <-->   mqtt topic url
 */


//Connect to firebase realtimedatabase
//  'im/event/#'
//suscribe to mqtt event topics and update corresponding firebase event entry
//  'im/command/#'
//watch firebase command entry, and publish them as a mqtt one in the corresponding item


 //on se connecte au broker (localhost) et on suscribe aux event message
var client = mqtt.connect('mqtt://localhost', { clientId: 'cloud' })
client.on('connect', function () {
    //commnad topics look like  im/event/
    client.subscribe('im/event/#')
})
//A new command as arrived
client.on('message', function (topic, strPlayload) {
    //TODO
})


