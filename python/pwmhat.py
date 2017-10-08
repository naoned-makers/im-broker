#!/usr/bin/python
# coding=UTF-8
import Adafruit_PCA9685
import time
import paho.mqtt.client as mqtt
import json
import sys
import os
import socket

class PwmHat:
  #Handle : pwm servo hat driver 
  def __init__(self,pwmhatmock='False'): # Notre méthode constructeur
    #Constructeur de notre classe. Chaque attribut va être instancié  avec une valeur par défaut... original
      self.pwmdevice = -1
      self.pwmhatmock = pwmhatmock;
      print "PWM INIT mock="+ pwmhatmock
      if self.pwmhatmock =='False':
        #pwmservodevice = PWM(0x40)
        self.pwmdevice = Adafruit_PCA9685.PCA9685(address=0x40)
        self.pwmdevice.set_pwm_freq(50) # Set frequency to 50Hz

  def setPWM(self,channel=0,servopulse = 0):
    print "PWM CHANNEL:"+str(channel)+" setPWM:"+str(servopulse)
    if self.pwmhatmock =='False':
      self.pwmdevice.set_pwm(int(channel), 0, int(servopulse))



#mock if they are almost one paramter
mock = os.getenv('IM_PWMHAT_MOCK', 'False')

# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags_dict, resultcode):
    print "PwmHat connected "+str(resultcode)
    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe("im/event/rpiheart/pwmhat/+")

# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    payload_json = json.loads(str(msg.payload))
    # useless check as we only suscribe to one topice for now
    channel = int(msg.topic.split("/")[-1])
    pwmhat.setPWM(channel,payload_json['pulse']);

client = mqtt.Client(client_id="pwmhat_"+socket.gethostname())
client.on_connect = on_connect 
client.on_message = on_message

#init pwm hat driver (i2c connection)
pwmhat = PwmHat(mock)
client.connect("localhost", 1883, 60)

# Blocking call that processes network traffic, dispatches callbacks and
# handles reconnecting.
# Other loop*() functions are available that give a threaded interface and a
# manual interface.
client.loop_forever()
