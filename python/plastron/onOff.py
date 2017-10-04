from animation import Animation
from neopixel import *
import time

class OnOff(Animation):

        def __init__(self, ring, speed, red, green, blue):
                Animation.__init__(self, ring, speed, red, green, blue)
                self.colorLight = Color(self.red - 100 if self.red - 100 > 0 else 0, self.green - 100 if self.green - 100 > 0 else 0, self.blue - 100 if self.blue - 100 > 0 else 0)

        def start(self):
                red = self.red
                green = self.green
                blue = self.blue

                for pos in range(0, self.ring.numPixels(), 1):
                        self.ring.setPixelColor(pos, self.color)

                while(red!=0 or green!=0 or blue!=0):
                        for pos in range(0, self.ring.numPixels(), 1):
                                self.ring.setPixelColorRGB(pos, red, green, blue)
                        red=red-10 if red - 10 >= 0 else 0
                        green=green-10 if green - 10 >= 0 else 0
                        blue=blue-10 if blue - 10 >= 0 else 0
                        self.ring.show()
                        time.sleep(self.speed)
                
                while(red<self.red or green<self.green or blue<self.blue):
                        for pos in range(0, self.ring.numPixels(), 1):
                                self.ring.setPixelColor(pos, Color(red, green, blue))
                        red=red+10 if self.red >= red + 10 else self.red
                        green=green+10 if self.green >= green + 10 else self.green
                        blue=blue+10 if self.blue >= blue + 10 else self.blue
                        self.ring.show()
                        time.sleep(self.speed)


