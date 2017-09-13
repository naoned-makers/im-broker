#!/usr/bin/python
# coding=UTF-8

import Adafruit_PCA9685
import time

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

def reset():
  #The Software Reset (SWRST) General Call allows the master to perform a reset of the
  # PCA9685 through the I2C-bus, identical to the Power-On Reset (POR) that initializes the
  # registers to their default state causing the outputs to be set LOW. This allows an easy and
  # quick way to reconfigure all device registers to the same condition via software.
  Adafruit_PCA9685.software_reset()

MODE1 = 0x00
SLEEP = 0x10

# FROM OTHER DRIVER EXAMPLE  https://github.com/voidpp/PCA9685-driver and https://cdn-shop.adafruit.com/datasheets/PCA9685.pdf
def sleep():
  """Send the controller to sleep"""
  time.sleep(0.005)  # wait for oscillator
  mode1 = pwmservodevice._device.readU8(MODE1)
  mode1 = mode1 | SLEEP
  pwmservodevice._device.write8(MODE1, mode1) # 1= Low power mode. Oscillator off
  time.sleep(0.005)  # wait for oscillator

def wake():
  """Wake up the controller"""
  time.sleep(0.005)  # wait for oscillator
  mode1 = pwmservodevice._device.readU8(MODE1)
  mode1 = mode1 & ~SLEEP  # wake up (reset sleep) ~ = Returns the complement of x - the number you get by switching each 1 for a 0 and each 0 for a 1.
  pwmservodevice._device.write8(MODE1, mode1)   #0 = Normal mode
  time.sleep(0.005)  # wait for oscillator  
