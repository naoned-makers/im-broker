# Utilisation du NeoPixel sur Raspberry

## Installation des drivers neopixel
suivre les instructions données à l'adresse https://learn.adafruit.com/neopixels-on-raspberry-pi/software

## Presentation

Fichier|Description
--- | ---
neo.py| Point d'entrée, peut être appelé en ligne de commande ou importé car il exporte une classe
animation.py| classe mère des animations
chenillard.py| classe d'animation chenillard
onOff.py|classe d'animation pour le clignotement progressif

## Paramètre en ligne de commande

**exemple**
```
sudo python neo.py -a 2 -r 256 -g 10 -b 255 -s 0.02 -n 20
```

Paramètre|Description|Defaut
--- | --- | ---
a| Type de l'animation à lancer| 3
s| la durée d'attente entre les cycles de l'animation en secondes| 0.1
r| Valeur du rouge| 0
g| Valeur du vert| 0
b| Valeur du bleu| 255
n| Nombre de fois que l'animation est répétée| 10

---


Type animation|Description
--- | ---
0| Extinction
1| Allumage
2| Clignotement progressif
3| Chenillard

---

## Utilisation de la classe dans un programme

```
from neo import Neo
...
...
...
neo = Neo(animation, speed, repeat, red, green, blue)
neo.go()

```
