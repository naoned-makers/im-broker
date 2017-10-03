
**Install**
```

sudo apt-get install python-pip python-dev build-essential python-smbus libzmq-dev i2c-tools
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install npm nodejs
sudo npm install -g npm
sudo npm install -g pm2
sudo pip install paho-mqtt
sudo pip install adafruit-pca9685
git clone   ... cd ...
npm install
```
Set auth envrionnement variables in user .bashrc
```
export im_cloud_apiKey=XXX
export im_cloud_projectId=XXX
export im_cloud_databaseName=XXX
```
Copy firebase service account file on root dir  xxx-firebase-adminsdk.json

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
pm2 dashoboard
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
im/command/energy/|off/blue/loading| {origin:'im-*'}|TO_DEFINE
im/command/eyes/|true/false| {origin:'im-*'}|TO_DEFINE
im/command/head/|move| {origin:'im-*'}
im/command/head/|facetrackmove| {origin:'im-*', absPosition: \<int absolute percent Position>}
im/command/leftarm/|move| {origin:'im-*'}
im/command/rightarm/|move| {origin:'im-*'}
im/command/lefthand/|move| {origin:'im-*'}
im/command/righthand/|move| {origin:'im-*'}
im/command/im/|server| {origin:'im-*',ip:\<ip> ,hostname:\<hostname>, mqttPort:\<mqttPort>, wsPort:\<wsPort>,httpPort:\<httpPort>}
im/command/im/|clients| {origin:'im-*', clients:[\< array broker client name>]}
im/command/reset/|all|{'origin':'im-*'}|TODO
im/command/chat/|listenstart|{'origin':'im-*'}
im/command/chat/|request|{'origin':'im-*','text':'la question'}
im/command/chat/|response|{'origin':'im-*','text':'la reponse du bot'}

Playload en json qui contient au moins un attribut origin

# MQTT and Firebase **Event** topics
## im/event/\<network target>/\<hardware target>/\<optional detail>

Event path|playload|comment
--- | --- | ---
im/event/rpiheart/pwmbreakout/2 | { pulse: \< int pulse value > }
im/event/rpiheart/status|{server:/<json serverInfo>, brokerClients:[\< array broker client name>]}
im/event/rpiheart/pin/2| TO_DEFINE|TO_DEFINE       
im/event/rpiheart/ledring|loading|TO_DEFINE
im/event/ia/chat/message|TODO

---
---
---

# DDD Model
Execute validation and consequential logic
## Aggregate:

    im
## Entity
Objects that have a distinct identity that runs through time and different representations:

    * eyes
    * energy
    * head
    * leftarm
    * rightarm
    * lefthand
    * righthand
## ValueObject:

    TODO


