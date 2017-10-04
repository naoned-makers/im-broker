from animation import Animation
from neopixel import *
import time

class Chenillard(Animation):

        def __init__(self, ring, speed, red, green, blue):
                Animation.__init__(self, ring, speed, red, green, blue)
                self.colorLight = Color(self.red - 150 if self.red - 150 > 0 else 0, self.green - 150 if self.green - 150 > 0 else 0, self.blue - 150 if self.blue - 150 > 0 else 0)


        def start(self):
                for pos in range(0, self.ring.numPixels(), 1):
                        self.ring.setPixelColor(self.getPreviousLed(self.getPreviousLed(pos)), 0)
                        self.ring.setPixelColor(self.getNextLed(self.getNextLed(pos)), 0)
                        self.ring.setPixelColor(self.getNextLed(pos), self.colorLight)
                        self.ring.setPixelColor(self.getPreviousLed(pos), self.colorLight)
                        self.ring.setPixelColor(pos, self.color)
                        self.ring.show()
                        time.sleep(self.speed)

