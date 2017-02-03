import random
from Screen import *

class Board:
    
    def __init__(self):
        
        self.dimension = 4
        self.array = [] # stores Cells
        self.NumLiving = 0
        self.RandOn = 0
        
    def initArray(self):
        # index retrieving size of board
        for i in range(0, self.dimension):
            row = []
            for j in range(0, self.dimension):
                row.append(0)
            self.array.append(row)
    # initiallize cells in constructed self.array
    def buildboard(self):
        
        for i in range(0, self.dimension):
            for j in range(0, self.dimension):
                self.array[i][j] = Cell(i, j)      
                self.array[i][j].life = 0  
    # apply move to Cells
    def Apply(self, direction):
        
        for i in range(0, self.dimension):
            for j in range(0, self.dimension):
                if direction == "Right":
                    x, y = j, (self.dimension - 1 - i)
                elif direction == "Left":
                    x, y = j, i
                elif direction == "Up":
                    x, y = i, j
                elif direction == "Down":
                    x, y = (self.dimension - 1 - i), j
                if self.array[x][y].value != 1:
                    self.array[x][y].move(self, direction)
        # Call RandCell for next turn
        self.RandCell(self.RandOn)
        self.RandOn = 0 # reset 
        if self.NumLiving == (self.dimension * self.dimension):
            print "DEAD"
                    
    def RandCell(self, loop):

        for i in range(loop):
            while 1:
                x = random.randint(0, 3)
                y = random.randint(0, 3)
                if self.array[x][y].value == 1:
                    v = random.randint(0, 1)
                    if v == 0:
                        self.array[x][y].value = 2
                    else:
                        self.array[x][y].value = 4
                    self.NumLiving += 1 # increment element living
                    break    
                    
class Cell:
    
    def __init__(self, x, y):
        
        self.x = x
        self.y = y
        self.value = 1
        
    def move(self, ObjBoard, direction):
        Arr = ObjBoard.array
        border = False
        # First set of cond: Find the next location
        # of Cell in board
        if direction == "Right":
            if self.y == 3:
                border = True
            else:
                nxt = Arr[self.x][self.y+1]
        elif direction == "Left":
            if self.y == 0:
                border = True
            else:
                nxt = Arr[self.x][self.y-1]
        elif direction == "Up":
            if self.x == 0:
                border = True
            else:
                nxt = Arr[self.x-1][self.y]
        else:
            if self.x == 3:
                border = True
            else:
                nxt = Arr[self.x+1][self.y]
        # Check next to merge, move, stall
        if border == False:
            if nxt.value == 1:
                self.Effects((nxt.x, nxt.y), 5) # call Effects
                nxt.value = self.value
                self.resetCell()
                nxt.move(ObjBoard, direction)
                ObjBoard.RandOn = 1 # call randCell 
            elif nxt.value == self.value:
                self.Effects((nxt.x, nxt.y), 5) # call Effects
                nxt.merge()
                self.resetCell()
                ObjBoard.RandOn = 1 # call randCell
                ObjBoard.NumLiving -= 1 # 1 Cell died
           
    #merge two square
    def merge(self):
        
        self.value *= 2
        
        if (self.value == 2048):
            #display win (call end function)
            pass
    # resetting cell to newborn
    def resetCell(self):
        
        self.value = 1

    def Effects(self, nxt, speed):
        
        start = [self.x*100, self.y*100]
        end = [nxt[0]*100, nxt[1]*100]

        while 1: 
            
            if start[0] == end[0] and start[1] == end[1]:
                break
            else:
                if start[0] != end[0]:
                    if start[0] < end[0]:
                        start[0] += speed
                    else:
                        start[0] -= speed
                if start[1] != end[1]:
                    if start[1] < end[1]:
                        start[1] += speed
                    else:
                        start[1] -= speed
        
            screen.blit(lookfor(1), (self.y*100, self.x*100))
            screen.blit(lookfor(self.value), (start[1], start[0]))
            pygame.display.update()