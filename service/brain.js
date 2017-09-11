
let mqtt = require('mqtt');
let os = require("os");
let entities = require('../domain/entities.js'); //Domains Entity

/**
 * command handler who listen to mqtt commande message topics
 * Logic based on CQRS E/S architecture
 */

//on se connecte au broker (localhost) et on suscribe aux command message
var client = mqtt.connect('mqtt://localhost', { clientId: 'brain_'+os.hostname()})
client.on('connect', function () {
    //commnad topics look like  im/command/<entity>/<command>
    client.subscribe('im/command/#');
    //Internal info look like  
    //      $SYS/rkM6tx45W/new/clients websimulator_9289e62f
    //      $SYS/B1PPagEqZ/disconnect/clients
    //client.subscribe('$SYS/+/+/clients')
})
//A new command as arrived
client.on('message', function (topic, strPlayload) {
    //TODO add a try catch

    var entityCode = topic.split("/")[2];
    var entityCommand = topic.split("/")[3];
    console.log('\x1b[36m%s\x1b[0m', entityCode + "/" + entityCommand + "->" + strPlayload);
    var playLoad = JSON.parse(strPlayload);
    //call the matching entity domain
    if (entities[entityCode + 'Entity']) {
        entities[entityCode + 'Entity'](client, entityCommand, playLoad);
    } else {
        console.log('\x1b[36m%s\x1b[0m', "Entity domain not found");
    }

})