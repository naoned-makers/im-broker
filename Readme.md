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
im/command/energy/|off/on/beat/chase| {origin:'im-*', °speed:\<int animation duration in ms>, °rgb:'FFFFFF'}|
im/command/eyes/|off/on/beat/chase| {origin:'im-*', °speed:\<int animation duration in ms>, °rgb:'FFFFFF'}}|
im/command/energy/|colorize| {origin:'im-*', °speed:\<int animation duration in ms>, °rgb:'FFFFFF'}|
im/command/eyes/|colorize| {origin:'im-*', °speed:\<int animation duration in ms>, °rgb:'FFFFFF'}}|
im/command/helmet/|move*| {origin:'im-*'}
im/command/helmet/|open| {origin:'im-*'}
im/command/helmet/|close| {origin:'im-*'}
im/command/helmet/|next| {origin:'im-*'}
im/command/head/|move*| {origin:'im-*'}
im/command/head/|next| {origin:'im-*'}
im/command/head/|facetrackmove| {origin:'im-*', absPosition: \<int absolute percent Position>}
im/command/head/|facetrackstart| {origin:'im-*', face: \<base64 png face img>}
im/command/rightarm/|set| {origin:'im-*', absPosition: \<int absolute percent Position>}
im/command/rightarm/|up| {origin:'im-*'}
im/command/rightarm/|down| {origin:'im-*'}
im/command/rightarm/|next| {origin:'im-*'}
im/command/rightarm/|move| {origin:'im-*'}
im/command/lefttarm/|set*| {origin:'im-*', absPosition: \<int absolute percent Position>}
im/command/lefttarm/|up| {origin:'im-*'}
im/command/lefttarm/|down| {origin:'im-*'}
im/command/lefttarm/|next| {origin:'im-*'}
im/command/lefttarm/|move| {origin:'im-*'}
im/command/lefthand/|set| {origin:'im-*', absPosition: \<int absolute percent Position>}
im/command/lefthand/|next| {origin:'im-*'}
im/command/lefthand/|move| {origin:'im-*'}
im/command/righthand/|set| {origin:'im-*', absPosition: \<int absolute percent Position>}
im/command/righthand/|next| {origin:'im-*'}
im/command/righthand/|move| {origin:'im-*'}
im/command/im/|color|{'origin':'im-*',°rgb:'FFFFFF'}}
im/command/im/|reset|{'origin':'im-*'}
im/command/chat/|listenstart|{'origin':'im-*'}
im/command/chat/|request|{'origin':'im-*','text':'la question'}
im/command/chat/|response|{'origin':'im-*','text':'la reponse du bot'}

° : Optional
Playload en json qui contient au moins un attribut origin

# MQTT and Firebase **Event** topics
## im/event/\<network target>/\<hardware target>/\<optional detail>

Event path|playload|comment
--- | --- | ---
im/event/rpiheart/pwmhat/\<pwm channel> | { pulse: \< int pulse value > }
im/event/rpiheart/status|{brokerClients:[\< array broker client name>]}      
im/event/rpiheart/usage| { memory: { free: 12831096832, total: 16477089792, percentage: 22 },  cpuUsage: '25.12', disk:{ free: 255911464960,total: 420273078272 } }
im/event/rpiheart/audio | { filename: \< string local filename value > }
im/event/esp8266/neopixel/\<A or B> | {°pattern:\<int NONE =0, RAINBOW=1, CHASE=2, COLOR_WIPE=3, SCANNER=4, FADE=5>,°interval:\<in interval time in ms>, °color1:\<int primary color value>, °color2:\<int color value>}

## Pixel Pattern
 * scanner: The Scanner pattern consists of a single bright led scanning back and forth, leaving a trail of fading leds behind as it goes.
 * chase:  pattern emulates the classic chase pattern from '50s era theater marquees (use color2).
 * wipe: The ColorWipe pattern paints a color, one pixel at a time, over the length of the strip. 
 * rainbow: The Rainbow Cycle uses the color wheel to create a rainbow effect that cycles over the length of the strip(use no color).
 * fader: This pattern produces a smooth linear fade from one color to another(use color2).

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

