#!/usr/bin/python
# coding=UTF-8

import paho.mqtt.client as mqtt
import pwmservo
import json
import sys
import os
import time


#mock if they are almost one paramter
mock = os.getenv('IM_SYNAPSE_MOCK', 'False')

# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags_dict, resultcode):
    print "Synapse connected "+str(resultcode)
    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe("im/rpiheart/pwmbreakout/+")

# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    print "Synapse Topic: ", msg.topic+" Message: "+str(msg.payload)
    # useless check as we only suscribe to one topice for now
    if msg.topic.startswith("im/rpiheart/pwmbreakout/"):
        channel = msg.topic.split("/")[-1]
        pwm = int(str(msg.payload))
        pwmservo.setPWM(channel,pwm);
    else: # Nul
        print("Unknown message")


client = mqtt.Client(client_id="synapse")
client.on_connect = on_connect 
client.on_message = on_message

#init pwm servo driver (i2c connection)
pwmservo.init(mock)

time.sleep(2)
client.connect("localhost", 1883, 60)

# Blocking call that processes network traffic, dispatches callbacks and
# handles reconnecting.
# Other loop*() functions are available that give a threaded interface and a
# manual interface.
client.loop_forever()