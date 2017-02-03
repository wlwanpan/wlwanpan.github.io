from pygame.locals import *
import pygame

class Enemy:
    
    def __init__(self,screen, r, v, x, y):
        
        self.r = r
        self.v = v
        self.x = x
        self.y = y
        self.screen = screen
        
    def move(self):
        
        self.y += self.v
        pygame.draw.circle(self.screen, (200, 20, 20), (self.x, self.y), self.r)