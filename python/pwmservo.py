#!/usr/bin/python
# coding=UTF-8
import Adafruit_PCA9685
import time

class PwmServo:
  #Handle : pwm servo breakout driver 
  def __init__(self,pwmservomock='False'): # Notre méthode constructeur
    #Constructeur de notre classe. Chaque attribut va être instancié  avec une valeur par défaut... original
      self.pwmservodevice = -1
      self.pwmservomock = pwmservomock;
      print "PWM INIT mock="+ pwmservomock
      if self.pwmservomock =='False':
        #pwmservodevice = PWM(0x40)
        self.pwmservodevice = Adafruit_PCA9685.PCA9685(address=0x40)
        self.pwmservodevice.set_pwm_freq(50) # Set frequency to 50Hz

  def setPWM(self,channel=0,servopulse = 0):
    print "PWM CHANNEL:"+str(channel)+" setPWM:"+str(servopulse)
    if self.pwmservomock =='False':
      self.pwmservodevice.set_pwm(int(channel), 0, int(servopulse))