import pygame, sys, os, random
from pygame.locals import *
from invader import *

pygame.init()
clock = pygame.time.Clock()

def menu():
    w, h = 800, 600
    screen = pygame.display.set_mode((w, h))
    global y
    y = 250
    while 1:
        clock.tick(5)

        menufont = pygame.font.Font(None, 50)
        play_text = menufont.render('Play', 2, (0, 255, 255))
        arrow_text = menufont.render('>', 2, (255, 255, 255))
        exit_text = menufont.render('Exit', 2, (0, 255, 255))
        name_text = menufont.render('Space Invader', 2, (255,255,255))
        
        for event in pygame.event.get():
            
            if event.type == pygame.QUIT:
                sys.exit()
            elif event.type == KEYDOWN:
                if event.key == K_DOWN and y != 300:   # down
                    y += 50
                elif event.key == K_UP and y != 250:   # up
                    y -= 50
                elif y == 300 and event.key ==  K_RETURN:
                    sys.exit()
                elif y == 250 and event.key == K_RETURN:
                    play([], [])
                    break
                    
        screen.fill((0,0,0))            
        screen.blit(arrow_text, (300, y))            
        screen.blit(play_text, (350, 250))        
        screen.blit(exit_text, (350, 300)) 
        screen.blit(name_text, (250, 50))
        pygame.display.update() 
        
menu()
        
