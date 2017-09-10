#!/usr/bin/python
# coding=UTF-8

from Adafruit_PWM_Servo_Driver import PWM

pwmservodevice = -1
pwmservomock = 'False'

def init(mocks='False'):
  # Initialise the PWM device using the default address
  global pwmservomock
  pwmservomock = mocks
  print "PWM INIT mock="+ pwmservomock
  if pwmservomock =='False':
    global pwmservodevice
    pwmservodevice = PWM(0x40)
    pwmservodevice.setPWMFreq(50) # Set frequency to 50Hz

def setPWM(channel=0,servopulse = 0):
  print "PWM CHANNEL:"+str(channel)+" setPWM:"+str(servopulse)
  global pwmservomock  
  if pwmservomock =='False':
    global pwmservodevice
    pwmservodevice.setPWM(int(channel), 0, int(servopulse))