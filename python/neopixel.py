#!/usr/bin/python
# coding=UTF-8
import paho.mqtt.client as mqtt
 
import json
import sys
import os
import socket
import time

#mock if they are almost one paramter
mock = os.getenv('IM_NEOPIXEL_MOCK', 'False')

if mock =='False':
    import plastron.neo as neo  

# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags_dict, resultcode):
    print "NeoPixel connected "+str(resultcode)
    # Subscribing in on_connect() means that if we lose the connection and reconnect then subscriptions will be renewed.
    client.subscribe("im/event/rpiheart/neopixel/+")

# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    payload_json = json.loads(str(msg.payload))
    # useless check as we only suscribe to one topice for now
    animation = msg.topic.split("/")[-1]
    speed = payload_json['speed']
    repeat = int(payload_json['repeat'])
    red = payload_json['red']
    green = payload_json['green']
    blue = payload_json['blue']
    print "ring mock:"+mock +" animation:" + animation +" speed:"+ str(speed) +" repeat:"+ str(repeat)+" red:"+ str(red)+" green:"+ str(green)+" blue:"+ str(blue)
    if mock =='False':
        if animation == 'on':
            neoring = neo.Neo(0, speed, repeat, red, green, blue)
            neoring.go()
        if (animation == 'off') :
            neoring = neo.Neo(1, speed, repeat, red, green, blue)
            neoring.go()
        if (animation == 'beat') :
            neoring= neo.Neo(2, speed, repeat, red, green, blue)
            neoring.go();
        if (animation == 'chase') :
            neoring= neo.Neo(3, speed, repeat, red, green, blue)
            neoring.go()
    else:
        time.sleep(speed*12*repeat);
        print "ring mock sleep ended"

client = mqtt.Client(client_id="neopixel_"+socket.gethostname())
client.on_connect = on_connect 
client.on_message = on_message

client.connect("localhost", 1883, 60)

# Blocking call that processes network traffic, dispatches callbacks and
# handles reconnecting.
# Other loop*() functions are available that give a threaded interface and a
# manual interface.
client.loop_forever()
