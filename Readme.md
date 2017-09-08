
*INSTAL*

//for pmwservodriver
sudo apt-get install python-smbus
sudo apt-get install libzmq-dev
pip install paho-mqtt


npm install -g pm2

npm install

*Start all applications*

npm run prod

*STARTUP script*

pm2 startup

*Monitoring*

pm2 monit

Logs see: pm2 logs
Logs flush: npm run clean

Command topics im/command/<entity>/<command>
* im/command/energy/        on | off | blue
* im/command/eyes/        true | false
* im/command/head/        move    |  set
* im/command/leftarm/        move    | set
* im/command/rightarm/        move    | set
* im/command/lefthand/        move    | set
* im/command/righthand/    move    | set
* im/command/reset/        all
playload en json qui contient au moins un attribut origin
{'status':status,'origin':'im-web'}

===============================

Domaine Model (execute validation and consequential logic)
Aggregate:

    im
Entity(Objects that have a distinct identity that runs through time and different representations):

    * eyes
    * energy
    * head
    * leftarm
    * rightarm
    * lefthand
    * righthand
ValueObject:

    TODO
===============================

Event topics
    *im/event/<rpiheart>/<pwmbreakout>/<channel>
exemple 
         im/event/rpiheart/pwmbreakout/2
          { pulse: <pulsevalue> }

*im/event/rpiheart/pin/2
         todefine
*im/event/rpiheart/ledring
         todefine