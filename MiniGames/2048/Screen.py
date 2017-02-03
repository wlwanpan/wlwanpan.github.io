import pygame
from pygame.locals import *

pygame.init()

screen = pygame.display.set_mode((400, 400))
pygame.display.set_caption('2048')
pygame.mouse.set_visible(1)
clock = pygame.time.Clock()

SpriteArray = []

# returns image of value x
def lookfor(x):    

    expo = 0
    while x != 1:
        x /= 2
        expo += 1
    return SpriteArray[expo]

# load image to SpriteArray
def loadimage(filename, maxNumber):

    for i in range(maxNumber+1):
        try:
            SpriteSheet = pygame.image.load('sprite/' +
                                            filename + 
                                            str(i) + '.png')
            #Resizing sprite image
            SprintSheet = pygame.transform.scale(SpriteSheet, (100, 100))
        except pygame.error, message:
            print "Cannot load image: ", filename
        SpriteArray.append(SpriteSheet)

# blits SpriteArrp[x] onto screen
def ArrSurf(arr):
    
    for i in arr:
        for j in i:
            pos_x = j.y * 100
            pos_y = j.x * 100
            screen.blit(lookfor(j.value), (pos_x, pos_y))
