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

  def reset(self):
    #The Software Reset (SWRST) General Call allows the master to perform a reset of the
    # PCA9685 through the I2C-bus, identical to the Power-On Reset (POR) that initializes the
    # registers to their default state causing the outputs to be set LOW. This allows an easy and
    # quick way to reconfigure all device registers to the same condition via software.
    if self.pwmservomock =='False':
      Adafruit_PCA9685.software_reset()

  MODE1 = 0x00
  SLEEP = 0x10

  # FROM OTHER DRIVER EXAMPLE  https://github.com/voidpp/PCA9685-driver and https://cdn-shop.adafruit.com/datasheets/PCA9685.pdf
  def sleep(self):
    """Send the controller to sleep"""
    time.sleep(0.005)  # wait for oscillator
    mode1 = self.pwmservodevice._device.readU8(PwmServo.MODE1)
    mode1 = mode1 | PwmServo.SLEEP
    self.pwmservodevice._device.write8(PwmServo.MODE1, mode1) # 1= Low power mode. Oscillator off
    time.sleep(0.005)  # wait for oscillator

  def wake(self):
    """Wake up the controller"""
    time.sleep(0.005)  # wait for oscillator
    mode1 = self.pwmservodevice._device.readU8(PwmServo.MODE1)
    mode1 = mode1 & ~PwmServo.SLEEP  # wake up (reset sleep) ~ = Returns the complement of x - the number you get by switching each 1 for a 0 and each 0 for a 1.
    self.pwmservodevice._device.write8(PwmServo.MODE1, mode1)   #0 = Normal mode
    time.sleep(0.005)  # wait for oscillator