
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