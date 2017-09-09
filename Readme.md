
**Install**
```
sudo apt-get install python-smbus
sudo apt-get install libzmq-dev
sudo pip install paho-mqtt
sudo npm install -g pm2
npm install
```
Set auth envrionnement variables
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
entity path|command|playload
--- | --- | ---
im/command/energy/|off/blue/loading| {'origin':'im-web'}
im/command/eyes/|true/false| {'origin':'im-web'}
im/command/head/|move| {'origin':'im-web'}
im/command/leftarm/|move| {'origin':'im-web'}
im/command/rightarm/|move| {'origin':'im-web'}
im/command/lefthand/|move| {'origin':'im-web'}
im/command/righthand/|move| {'origin':'im-web'}
im/command/reset/|all|{'origin':'im-web'}

Playload en json qui contient au moins un attribut origin

# MQTT and Firebase **Event** topics
## im/event/\<network target>/\<hardware target>/\<optional detail>

Event path|playload
--- | --- 
im/event/rpiheart/pwmbreakout/2 | { pulse: \<pulsevalue> }
im/event/rpiheart/pin/2| todefine       
im/event/rpiheart/ledring|  todefine

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


