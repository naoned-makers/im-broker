let mqtt = require('mqtt');

/**
 * do heavy mqtt load
 */

 //on se connecte au broker (localhost) et on suscribe aux event message
var client = mqtt.connect('mqtt://localhost', { clientId: 'im-load' })
client.on('connect', function () {
    //commnad topics look like  im/event/


    var interval = setInterval(function() {
        client.publish("im/command/head/move",JSON.stringify("{'nothing':'nada'}"),console.info);
      }, 10);
      
      //clearInterval(interval);
})