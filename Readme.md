**What's inside**
* An express web server [service/web.js](service/web.js) who serve [on port 8080](http://ironman:8080/) the static touch web interface of im [web/touchstart.html](web/touchstart.html)
* An mqtt broker [service/broker.js](service/broker.js) who is accessible on MQTT standard port 1883 (for nodejs and python client) and also on MQTT over websocket on port 3000 (for browser mqtt client)
* A firebase cloud gateway [service/cloud.js](service/cloud.js) that watch new command on firebase realtime database to publish coresponding mqtt message.
* A logic processing module [service/brain.js](service/brain.js) who subscribe to mqtt command topic and dispatch workout to [domain/entities.js](domain/entities.js). Entities are the nodejs statefull representation (using mobx-state-tree) of im part(head,helmet,leftarm,rightarm,lefthand,righthand,eyes,energy). Each entity is responsible to generate mqtt event response for his im-part based on im-current state and incomming solicitation.
* A pwmhat python controller [python/pwmhat.py](python/pwmhat.py) that set the HAT pusleWithModulation value from the mqtt topic im/event/rpiheart/pwmhat/{channel} value.
* An nodejs audio output module [service/sound.js](service/sound.js) that subscribe to im/event/rpiheart/audio mqtt topic and play matching mp3 file located located in the local [sound](sound) directory


**What is not inside** but that must be on the same root directory as im-broker to work
* [im-admin](https://github.com/naoned-makers/im-admin) who take care to boot all im module via pm2 and also provide an web interface for im administration and im simulatiom
* [im-camera](https://github.com/naoned-makers/im-camera) a python module who interpret camera input to generate mqtt command

**Other im module**
* [im-firebase](https://github.com/naoned-makers/im-firebase) A firbase function (faas) and realtime database project that handle the cloud (dialogflow) to local communication
* [im-vui]( https://github.com/naoned-makers/im-vui) An android studio project for building the android voice and touch interface available on the [play store](https://play.google.com/store/apps/details?id=io.naonedmakers.imvui)
* [im-neopixel]( https://github.com/naoned-makers/im-neopixel) An ESP8266 script that subscribe to im/event/esp8266/neopixel mqtt topic and drive neopixel led strip.


**Project Install**
```

sudo apt-get install python-pip python-dev build-essential python-smbus libzmq-dev i2c-tools  git scons swig
sudo apt-get install libavahi-compat-libdnssd-dev avahi-daemon libsox-fmt-mp3 mpg123

curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install npm nodejs
npm install -g npm
npm install -g pm2
sudo pip install paho-mqtt
sudo pip install adafruit-pca9685
sudo pip install rpi_ws281x
git clone   ... cd ...
npm install
```
Set auth envrionnement variables in  user .bashrc
```
export im_cloud_apiKey=XXX
export im_cloud_projectId=XXX
export im_cloud_databaseName=XXX



```
Copy firebase service account file on user dir  xxx-firebase-adminsdk.json



---

**Start all applications**
```
npm run prod
```
**Boot script**
```
pm2 startup
```
**Monitoring**
```
pm2 dash
```
**LOGS**
```
pm2 logs
pm2 flush
```


# MQTT and Firebase **Command** topics
##  im/command/\<entity\>/\<command>
entity path|command|playload|comment
--- | --- | --- | ---
im/command/energy/|off/on/beat/chase| {origin:'im-*', speed:\<ms>, rgb:FFFFFF}|
im/command/eyes/|off/on/beat/chase| {origin:'im-*', speed:\<ms>, rgb:FFFFFF}}|
im/command/eyes/|color| {origin:'im-*',rgba:'FFFFFFFF'}|
im/command/helmet/|move*| {origin:'im-*'}
im/command/helmet/|open| {origin:'im-*'}
im/command/helmet/|close| {origin:'im-*'}
im/command/helmet/|next| {origin:'im-*'}
im/command/head/|move*| {origin:'im-*'}
im/command/head/|next| {origin:'im-*'}
im/command/head/|facetrackmove| {origin:'im-*', absPosition: \<int absolute percent Position>}
im/command/head/|facetrackstart| {origin:'im-*', face: \<base64 png face img>}
im/command/rightarm/|move*| {origin:'im-*'}
im/command/rightarm/|up| {origin:'im-*'}
im/command/rightarm/|down| {origin:'im-*'}
im/command/rightarm/|next| {origin:'im-*'}
im/command/lefthand/|move*| {origin:'im-*'}
im/command/lefthand/|next| {origin:'im-*'}
im/command/im/|server| {origin:'im-*',ip:\<ip> ,hostname:\<hostname>, mqttPort:\<mqttPort>, wsPort:\<wsPort>,httpPort:\<httpPort>}
im/command/im/|reset|{'origin':'im-*'}|
im/command/chat/|listenstart|{'origin':'im-*'}
im/command/chat/|request|{'origin':'im-*','text':'la question'}
im/command/chat/|response|{'origin':'im-*','text':'la reponse du bot'}

Playload en json qui contient au moins un attribut origin

# MQTT and Firebase **Event** topics
## im/event/\<network target>/\<hardware target>/\<optional detail>

Event path|playload|comment
--- | --- | ---
im/event/rpiheart/pwmhat/2 | { pulse: \< int pulse value > }
im/event/rpiheart/status|{brokerClients:[\< array broker client name>]}      
im/event/rpiheart/usage| { memory: { free: 12831096832, total: 16477089792, percentage: 22 },  cpuUsage: '25.12', disk:{ free: 255911464960,total: 420273078272 } }
im/event/rpiheart/audio | { filename: \< string local filename value > }
im/event/esp8266/neopixel/<pin> |off/on/beat/chase| {speed:\<ms>, rgb:FFFFFF}
---
---
---

# DDD Model
Execute validation and consequential logic
## Aggregate:
    im
## Entity
Objects that have a distinct identity that runs through time and different representations:

    * helmet
    * head
    * leftarm
    * rightarm
    * lefthand
    * righthand
    * eyes
    * energy