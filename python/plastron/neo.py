# Author: Tony DiCola (tony@tonydicola.com)
#
# Direct port of the Arduino NeoPixel library strandtest example.  Showcases
# various animations on a strip of NeoPixels.
import time
import sys, getopt
from chenillard import Chenillard
from onOff import OnOff

from neopixel import *

# LED ring configuration:
LED_COUNT      = 16      # Number of LED pixels.
LED_PIN        = 18      # GPIO pin connected to the pixels (18 uses PWM!).
LED_FREQ_HZ    = 800000  # LED signal frequency in hertz (usually 800khz)
LED_DMA        = 5       # DMA channel to use for generating signal (try 5)
LED_BRIGHTNESS = 255     # Set to 0 for darkest and 255 for brightest
LED_INVERT     = False   # True to invert the signal (when using NPN transistor level shift)
LED_CHANNEL    = 0       # set to '1' for GPIOs 13, 19, 41, 45 or 53
LED_STRIP      = ws.WS2811_STRIP_GRB   # Strip type and colour ordering

animation = 3
speed = 0.1
red = 0
green = 0
blue = 255
repeat = 10
        

class Neo:

        def __init__(self, animation, speed, repeat, red, green, blue):
                self.repeat = repeat
                self.speed = speed
                self.red = red
                self.green = green
                self.blue = blue
                self.animation = animation
                self.ring = Adafruit_NeoPixel(LED_COUNT, LED_PIN, LED_FREQ_HZ, LED_DMA, LED_INVERT, LED_BRIGHTNESS, LED_CHANNEL, LED_STRIP)
        
                # Intialize the library (must be called once before other functions).
                self.ring.begin()


        def go(self):

                anim = None
                if self.animation == 0:
                        anim = Chenillard(self.ring, self.speed, self.red, self.green, self.blue)
                        anim.clearAll()
                        repeat = 0
                elif self.animation == 1:
                        anim = OnOff(self.ring, self.speed, self.red, self.green, self.blue)
                        anim.lightAll()
                        repeat = 0
                elif self.animation == 2:
                        anim = OnOff(self.ring, self.speed, self.red, self.green, self.blue)
                elif self.animation == 3:
                        anim = Chenillard(self.ring, self.speed, self.red, self.green, self.blue)

                print ('Press Ctrl-C to quit, or wait repeat : ', self.repeat)
                for i in range(self.repeat):
                        anim.clearAll()
                        anim.start()

        
def parseParameters(argv):
        
        global animation
        global speed
        global red
        global green
        global blue
        global repeat

        try:
                opts, args = getopt.getopt(argv,"s:r:g:b:n:",["animation=","speed=","red=","green=","blue=","ntimes="])
        except getopt.GetoptError:
                print 'test.py -a <animation> -s <speed> -r <red> -g <green> -b <blue> -n <n times exe>'
                sys.exit(2)
        for opt, arg in opts:
                if opt == '-h':
                        print 'test.py -a <animation> -s <speed> -r <red> -g <green> -b <blue> -n <n times exe>'
                        sys.exit()
                elif opt in ("-a", "--animation"):
                        animation = int(arg)
                elif opt in ("-s", "--speed"):
                        speed = float(arg)
                elif opt in ("-r", "--red"):
                        red = int(arg)
                elif opt in ("-g", "--green"):
                        green = int(arg)
                elif opt in ("-b", "--blue"):
                        blue = int(arg)
                elif opt in ("-n", "--ntimes"):
                        repeat = int(arg)

        print 'animation : ', animation
        print 'speed : ', speed
        print 'red : ', red
        print 'green : ', green
        print 'blue : ', blue
        print 'repeat : ', repeat

if __name__ == '__main__':
        # get parameter
        parseParameters(sys.argv[1:])
        neo = Neo(speed, repeat, red, green, blue)
        neo.go()


