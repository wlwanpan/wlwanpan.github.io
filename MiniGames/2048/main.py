from Class import *
        
def main():
    
    board = Board()
    board.initArray() # initiallize array
    board.buildboard() # init cells in array
    
    board.RandCell(2) # init game rand 2 Cells
    
    loadimage('number', 12) # loading value images
    
    while 1:
    
        clock.tick(20)
        screen.fill((0, 0, 0))
        ArrSurf(board.array) # test change seq for effect
        
        for event in pygame.event.get():
            
            if event.type == pygame.QUIT:
                break
                
            elif event.type == KEYDOWN:
                direction = None
                if event.key == K_a or event.key == K_LEFT:
                    direction = "Left"
                elif event.key == K_d or event.key == K_RIGHT:
                    direction = "Right"
                elif event.key == K_s or event.key == K_DOWN:
                    direction = "Down"
                elif event.key == K_w or event.key == K_UP:
                    direction = "Up"
                    
                if direction:
                    board.Apply(direction)    
                      
        pygame.display.update()
               
main()