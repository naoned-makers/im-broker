"use strict";
let mqtt = require('mqtt');
let firebase = require("firebase");
let admin = require("firebase-admin");
let os = require("os");



/**************************************************************************************************************************
 * A internet gateway that synchronize one way between an internet firebase realtime database and local mqtt broker
 *      firebase path  <-->   mqtt topic url
 *************************************************************************************************************************/

// Fetch the service account key JSON file contents
const serviceAccount = require("../firebase-adminsdk.json");

//FIREBASE config store un environnement variables
const config = {
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
let app = admin.initializeApp(config);
let defaultDatabase = admin.database();

/*************************************************
* watch real firebase connected status
* and connect to mqtt when it is up
*
*   Need to inform both part of the connection state
*   firebase Side: FS_ON/OFF
*   mqtt side: MS_ON/OFF
*
***********************************************/
var client;
defaultDatabase.ref(".info/connected").on("value", function (snap) {
    console.log(defaultDatabase.INTERNAL.isWebSocketsAvailable);
    if (snap.val() === true) {
        console.log('Firebase connected');
        //MS_OFF will: a message that will sent by the broker automatically when the client disconnect badly. The format is:
        client = mqtt.connect('mqtt://localhost', {
            clientId: 'cloud_' + os.hostname(),
            will: {
                topic: "im/command/im/cloud",
                payload: JSON.stringify({ origin: 'cloud', online: false })
            }
        });
        /************************************************
        suscribe to mqtt event topics and update corresponding firebase event entry
        ***********************************************/
        client.on('connect', function () {
            //only event topics usefull on internet
            //FS_ON Retain status will be soon handle 
            client.subscribe('im/event/rpiheart/status');
            //MS_ON We are ONLINE !!
            client.publish("im/command/im/cloud", JSON.stringify({ origin: 'cloud', online: true }));
        })
        //A new mqtt event need to be sync to firebase
        client.on('message', function (topic, strPlayload) {
            let playLoad = JSON.parse(strPlayload);
            //Firebase don't trigger event if there is no difference so we need to add a timestamp
            if (!playLoad.ts) { playLoad.ts = Date.now(); }
            //sync it to firebase
            defaultDatabase.ref(topic).set(playLoad).catch(function (error) {
                // Uh-oh, an error occurred!
                console.log('error', error);
            });
        })
        /**
         * FS_OFF Direct change the rpiheart/status on firebase server side whitout brain uses
         */
        defaultDatabase.ref('im/event/rpiheart/status/offline').onDisconnect().set(firebase.database.ServerValue.TIMESTAMP);
        defaultDatabase.ref('im/event/rpiheart/status/offline').remove();
    } else {
        console.log('Firebase not connected');
        //Send cloud offline command information
        if (client) {
            client.end();
            client = undefined;
        }
    }
});

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
        if (client) {
            client.publish(topic, JSON.stringify(playload));
        } else {
            console.log('But mqtt broket is not connected ');
        }

    });
});

process.on('SIGINT', function() {
    console.log('cloud shutdown');
    defaultDatabase.goOffline();
    process.exit(0);
});
