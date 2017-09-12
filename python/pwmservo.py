#!/usr/bin/python
# coding=UTF-8

import Adafruit_PCA9685

pwmservodevice = -1
pwmservomock = 'False'

def init(mocks='False'):
  # Initialise the PWM device using the default address
  global pwmservomock
  pwmservomock = mocks
  print "PWM INIT mock="+ pwmservomock
  if pwmservomock =='False':
    global pwmservodevice
    #pwmservodevice = PWM(0x40)
    pwmservodevice = Adafruit_PCA9685.PCA9685(address=0x40)
    pwmservodevice.set_pwm_freq(50) # Set frequency to 50Hz

def setPWM(channel=0,servopulse = 0):
  print "PWM CHANNEL:"+str(channel)+" setPWM:"+str(servopulse)
  global pwmservomock  
  if pwmservomock =='False':
    global pwmservodevice
    pwmservodevice.set_pwm(int(channel), 0, int(servopulse))