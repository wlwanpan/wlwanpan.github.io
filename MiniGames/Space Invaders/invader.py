import pygame, os, random, sys, time
from pygame.locals import *
from bullet import *
from enemy import *

pygame.init()

w, h = 800, 600
clock = pygame.time.Clock()
screen = pygame.display.set_mode((w,h))
pygame.mouse.set_visible(0)

# Variables  
bullet_count = 0
b_radius = 2
sp_count = 0
life = 50
score = 0

# Properties of Enemy
ene_lst = []
lvl = 20
timer = lvl
radius = 20
velocity = 1
level = 1
# __init__ life pack self.r = 1 (present)
lifepack = Bullet(screen, 1, random.randint(30, w-30), 0, 0)
    # consumes bullet lst, enemy list, special list
def check(a, b, c):
    enemy_kill = False
    for enemy in b:
        # Check for bullet collision
        for bul in a:
            if abs(bul.x - enemy.x) < radius+b_radius and abs(enemy.y - bul.y) < radius+b_radius: 
                    a.remove(bul)
                    enemy_kill = True               
                    break;
            if bul.y - bul.r < 0:
                a.remove(bul)
        # Check for Specal bullet collision        
        for sp in c:
            if enemy.x > sp.x-sp.w and enemy.x < sp.x+sp.w:
                if enemy.y+radius > sp.y:
                    enemy_kill = True
            
        if enemy_kill:
            b.remove(enemy)
            enemy_kill = False
            return 'KILL'
        
def play(b, s):  
    
    clock = pygame.time.Clock()
    clock.tick(45)
    sp_weapon = False
    end = False
    
    # global def
    global screen
    global ene_lst
    global score
    global bullet_count
    global b_radius
    global sp_count
    global life
    global score
    global lvl
    global timer
    global radius
    global velocity
    global level
    global lifepack
    
    ship = pygame.image.load('ship2.png')
    ship_top = screen.get_height() - ship.get_height()
    ship_left = screen.get_width()/2 - ship.get_width()/2
    
    while end == False:
        # size of txt
        gamefont = pygame.font.Font(None, 20)
        gamefont2 = pygame.font.Font(None, 50)
        # displays render
        scoretext = gamefont.render('Score: ' + str(score), 2, (0,255, 0))
        lifetext = gamefont.render('Life: ' + str(life), 2, (0,255, 0))
        leveltext = gamefont.render('Level: ' + str(level), 2, (0, 255, 0))
        gameovertext = gamefont2.render('GAME OVER', 5, (255, 0, 0))
        # FPS
        clock.tick(45)
        # Black screen RGB
        screen.fill((0,0,0))
        
        mouse_x, mouse_y = pygame.mouse.get_pos()    # get position of the mouse
        screen.blit(ship, (mouse_x-ship.get_width()/2, ship_top))
    
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                end = True
            elif event.type == MOUSEBUTTONDOWN:
                b.append(Bullet(screen, 5, mouse_x, 550, 1))
                bullet_count += 1
            elif event.type == KEYDOWN:
                if event.key == K_SPACE and sp_weapon:
                    if sp_count < 15:    
                        s.append(Bullet(screen, b_radius, mouse_x, 550, 1))
                        sp_count += 1
                if event.key == K_RETURN and life ==  0:
                    end = True
    
        # append ene in list_ene
        timer -= 1
        if timer == 0:
            rand = random.randint(radius,w-radius)
            ene_lst.append(Enemy(screen, radius, velocity, rand, 0))
            timer = lvl
        # Displays ene        
        for enemy in ene_lst:
            enemy.move()
            if enemy.y > h:
                ene_lst.remove(enemy)
                if life == 0:
                    screen.blit(gameovertext, ((w/2)-100, (h/2)-50))  
                else:
                    life -= 1
        for sp in s:
            sp.special_move(s)
        # displays bullet        
        for i in b:
            i.shoot()
            if i.y < 0:
                b.remove(i)
        # Update the score    
        if check(b, ene_lst, s):
            if life == 0:
                pass
            else:
                score += 1
        # Level up --------------   
        
        if score > 15 and score <= 50:
            level = 2
            radius = 17
            velocity = 2
            lvl = 15
            lifepack.weapon()
        elif score > 50 and score <= 75:
            level = 3
            velocity = 7
            radius = 15
            lvl = 5
        elif score > 75:
            level = 'DIE'
            velocity = 15
            lvl = 1
        # check if special weapon reached 
        if abs(lifepack.x-mouse_x)<10 and abs(lifepack.y-ship_top)<10:
            sp_weapon = True
            lifepack.r = 0    # 0 = disappear
        # screen display      
        screen.blit(scoretext, (0, 0))
        screen.blit(lifetext, (0, 15))
        screen.blit(leveltext, (0, 30))
        
        #console print
        os.system('cls')
        print timer
        check(b, ene_lst, s)
        pygame.display.update() 
      

            