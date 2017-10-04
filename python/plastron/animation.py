from neopixel import *

class Animation:

        def __init__(self, ring, speed, red, green, blue):
                self.ring = ring
                self.red = red
                self.green = green
                self.blue = blue
                self.speed = speed
                self.color = Color(self.red, self.green, self.blue)

        def getPreviousLed(self, pos, offset=1):
                if pos - offset < 0:
                        return self.ring.numPixels() - pos - offset
                return pos - offset

        def getNextLed(self, pos, offset=1):
                if pos + offset > self.ring.numPixels():
                        return pos + offset - self.ring.numPixels()
                return pos + offset

        def clearAll(self):
                for i in range(0, self.ring.numPixels(), 1):
                        self.ring.setPixelColor(i, 0)
                self.ring.show()

        def lightAll(self):
                for i in range(0, self.ring.numPixels(), 1):
                        self.ring.setPixelColor(i, self.color)
                self.ring.show()
                
        def getColor(self, red, green, blue, min):
                if min:
                        return Color(red if red >= 0 else 0, green if green >= 0 else 0, blue if blue >= 0 else 0)
                return Color(red if red <= self.red else self.red, green if green <= self.green else self.green, blue if blue <= self.blue else self.blue)
