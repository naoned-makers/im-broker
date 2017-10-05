#!/usr/bin/python
# coding=UTF-8

import paho.mqtt.client as mqtt
import pwmservo as pwm
from plastron import neo
import json
import sys
import os
import socket

#mock if they are almost one paramter
mock = os.getenv('IM_SYNAPSE_MOCK', 'False')

# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags_dict, resultcode):
    print "Synapse connected "+str(resultcode)
    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe("im/event/rpiheart/#")

# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    #print "Synapse Topic: ", msg.topic+" Message: "+str(msg.payload)
    payload_json = json.loads(str(msg.payload))
    # useless check as we only suscribe to one topice for now
    if msg.topic.startswith("im/event/rpiheart/pwmbreakout/"):
        channel = int(msg.topic.split("/")[-1])
        pwmservo.setPWM(channel,payload_json['pulse']);
    if msg.topic.startswith("im/event/rpiheart/ledring/"):
        animation = int(msg.topic.split("/")[-1])
        speed = payload_json['speed']
        repeat = payload_json['repeat']
        red = payload_json['red']
        green = payload_json['green']
        blue = payload_json['blue']
        print "ring animation" + animation +" speed:"+ str(speed) +" repeat:"+ str(repeat)+" red:"+ str(red)+" green:"+ str(green)+" blue:"+ str(blue)
        if animation == 'on':
            neo = Neo(0, speed, repeat, red, green, blue)
            neo.go()
        if (animation == 'off') :
            neo = Neo(1, speed, repeat, red, green, blue)
            neo.go()
        if (animation == 'beat') :
            neo = Neo(2, speed, repeat, red, green, blue)
            neo.go();
        if (animation == 'chase') :
            neo = Neo(3, speed, repeat, red, green, blue)
            neo.go()
    else: # Nul
        print("Unknown message")

client = mqtt.Client(client_id="synapse_"+socket.gethostname())
client.on_connect = on_connect 
client.on_message = on_message

#init pwm servo driver (i2c connection)
pwmservo = pwm.PwmServo(mock)
client.connect("localhost", 1883, 60)

# Blocking call that processes network traffic, dispatches callbacks and
# handles reconnecting.
# Other loop*() functions are available that give a threaded interface and a
# manual interface.
client.loop_forever()