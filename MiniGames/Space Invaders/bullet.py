from pygame.locals import *
import pygame, random

class Bullet:

    def __init__(self,screen, r, x, y, w):
        
        self.r = r
        self.x = x
        self.y = y
        self.w = w
        self.screen = screen
                
    def shoot(self):
        
        self.y -= 10
        pygame.draw.circle(self.screen, (50, 50, 250), (self.x, self.y), self.r)
        
    def special_move(self, s2):
        self.w += 1
        self.y -= 5
        if self.y < 0:
            s2.remove(self)
        pygame.draw.line(self.screen, (random.randint(0,255), random.randint(0,255), random.randint(0,255)), (self.x-self.w, self.y), (self.x+self.w, self.y), self.r)
    
    def weapon(self):
        points = [(self.x, self.y), (self.x-20, self.y+20), (self.x+20, self.y+20)]

        self.y += 7
        if self.r == 1:
            pygame.draw.polygon(self.screen, (random.randint(0,255), random.randint(0,255), random.randint(0,255)), points, 0)