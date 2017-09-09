let mqtt = require('mqtt');
let firebase = require("firebase");
let admin = require("firebase-admin");

/**************************************************************************************************************************
 * A internet gateway that synchronize one way between an internet firebase realtime database and local mqtt broker
 *      firebase path  <-->   mqtt topic url
 *************************************************************************************************************************/

// Fetch the service account key JSON file contents
var serviceAccount = require("../firebase-adminsdk.json");

//FIREBASE config store un environnement variables
let config = {
    credential: admin.credential.cert(serviceAccount),
    databaseAuthVariableOverride: {
        uid: "im-cloud"
    },
    apiKey: process.env.im_cloud_apiKey,
    authDomain: process.env.im_cloud_projectId + ".firebaseapp.com",
    databaseURL: "https://" + process.env.im_cloud_databaseName + ".firebaseio.com",
    storageBucket: process.env.im_cloud_databaseName + ".appspot.com",
};

/*************************************************
* Connect to firebase realtimedatabase
***********************************************/
admin.initializeApp(config);
let defaultDatabase = admin.database();


/************************************************
suscribe to mqtt event topics and update corresponding firebase event entry
***********************************************/
let client = mqtt.connect('mqtt://localhost', { clientId: 'cloud' })
client.on('connect', function () {
    //commnad topics look like  im/event/
    client.subscribe('im/event/#')
})
//A new event as arrived
client.on('message', function (topic, strPlayload) {
    let playLoad = JSON.parse(strPlayload);
    //console.log(topic, playLoad);
    //sync it to firebase
    defaultDatabase.ref(topic).set(playLoad).catch(function (error) {
        // Uh-oh, an error occurred!
        console.log('error', error);
    });
})

/**********************************************
*watch firebase command entry, and publish them as a mqtt one in the corresponding item
***********************************************/
//im/command/<entity>/<command>
let commandRef = defaultDatabase.ref('im/command');
//Must listen command from all entity, otherwise in firebase we cant determine which one of the child of the child that as changed
commandRef.on('child_added', function (entitySnapshot) {
    var entity = entitySnapshot.key;
    entitySnapshot.ref.on('child_changed', function (entityCommandSnapshot) {
        let commandType = entityCommandSnapshot.key;//move
        let playload = entityCommandSnapshot.val();// { origin: 'im-cloud' }
        let topic = "im/command/" + entity + "/" + commandType;
        console.log('Firebase changed ' + topic, playload);
        client.publish(topic, JSON.stringify(playload), console.info); 0
    });
});