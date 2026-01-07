from tkinter import *
import tkinter as tk
import os
# program initialisation variables
loadfromfile = True
height     = 20
width      = 20
#tool colors
background = 'grey'
void       = 'black'
warning    = 'red'
# program specific variables
genorationmode="none"
speciallist=["hole","lampost","window","door","tree","rainbow","noticeboard","step","stepdown","bridge1x1","bridge1x2","bridge1y1","bridge1y2","bridge2x1","bridge2x2","bridge2y1","bridge2y2"]
master   = Tk()                                                                               # define tkinter (gui)
#os.system('CLS')                                                                            # clear the screen output
master.configure(bg=background)                                                            # make the background green
SW            = master.winfo_screenwidth()                                                       # find the screen width
SH            = master.winfo_screenheight()  
size          = 150                                                       # find the screen height
buttonpanel   = tk.Frame(master,background=background,width=size,height=SH)
outputHeight  = [['']*height for _ in range(width)] # _ signifyes a variable we do not care about, ie it is a variable that does not exist
outputSpecial = [['']*height for _ in range(width)]
outputColour  = [['']*height for _ in range(width)]
def readfile():
    global height, width, outputHeight, outputColour, outputSpecial
    f = open("levelbuilder/readWorld.txt", "r")
    read = f.read()
    f.close()
    read = read.replace(" ","")
    read = read.replace(",,",",'',")
    read = read.replace("[,","['',")
    read = read.replace("[\n","")
    read = read.replace("[[","[")
    read = read.replace("];","")
    read = read.replace("]]\n","]")
    read = read.split('],\n')

    for x in range(0,len(read)): 
        read[x] = read[x].replace("],[","] , [")
        read[x] = read[x].split(" , ")
        for y in range(0,len(read[x])):
            read[x][y] = read[x][y].replace("[","")
            read[x][y] = read[x][y].replace("]","")
            read[x][y] = read[x][y].split(",")
            for z in range(0,len(read[x][y])):
                if read[x][y][z] =="''": read[x][y][z] =""   
    readheight = max([len(read[x]) for x in range(len(read))])
    readwidth = len(read)
    height = readheight
    width  = readwidth
    print('read file is',readwidth,'by',readheight)
    maxz = max([len(read[x][y]) for x in range(len(read)) for y in range(len(read[x]))]) 
    minz = min([len(read[x][y]) for x in range(len(read)) for y in range(len(read[x]))]) 
    if maxz!=minz:
        for x in range(len(read)):
            for y in range(len(read[x])):
                print(len(read[x][y]),end='')
            print()
        print('critical fileread error') 
        exit(0)
    outputHeight  = [['']*height for _ in range(width)]
    outputSpecial = [['']*height for _ in range(width)]
    outputColour  = [['']*height for _ in range(width)]
    for x in range(0,len(read)): 
        for y in range(0,len(read[x])): 
            outputHeight [x][y]=read[x][y][0]
            outputSpecial[x][y]=read[x][y][1].replace("'","")
            outputColour [x][y]=read[x][y][2].replace("'","").replace("\n","")
if loadfromfile:readfile()
def fillTable(type):
    global cells, outputHeight, outputColour, outputSpecial
    match type:
        case "height":
            activeList=outputHeight
        case "special":
            activeList=outputSpecial
        case "colour":
            activeList=outputColour
    for x in range(len(activeList)):
        for y in range(len(activeList[x])):
            cells[(x,y)].delete(0, tk.END)
            cells[(x,y)].insert(0, activeList[x][y])

def setModeHeight():
    global genorationmode
    genorationmode = "height"
    fillTable("height")
def setModeColour():
    global genorationmode
    genorationmode = "colour"
    fillTable("colour")
def setModeSpecial():
    global genorationmode
    genorationmode = "special"
    fillTable("special")
def Export():
    global outputHeight, outputColour, outputSpecial
    newlist= [[['']*3 for _ in outputHeight[x]] for x in range(len(outputHeight))]
    for x in range(0,len(outputHeight)):
        for y in range(0,len(outputHeight[x])):
            special=''
            if type(outputSpecial[x][y]) is int:
                special = str(speciallist[int(outputSpecial[x][y])])            
            else:
                special = outputSpecial[x][y]
            newlist[x][y] = [str(outputHeight[x][y]),"'"+special+"'","'"+str(outputColour[x][y])+"'"]

    f = open("levelbuilder/readWorld.txt", "w")
    print('[',file=f)
    for x in range(0,len(newlist)):
        print('     [',end='',sep='',file=f)
        for y in range(0,len(newlist[x])):
            print('[',end='',sep='',file=f)
            for z in range(0,2):    
                print(str(newlist[x][y][z])+',',end='',sep='',file=f)
            print(str(newlist[x][y][2]),end='',sep='',file=f)
            if y!=len(newlist[x])-1:
                print('],',end='',sep='',file=f)
            else: print(']',end='',sep='',file=f)
        if x!=len(newlist)-1:
            print('],           ',file=f) 
        else: print(']',sep='',file=f)
    print('];',file=f)
    f.close()
    print("exported!")
Cellx=0
Celly=0
button1  = Button(buttonpanel,text ='height mode',  command = setModeHeight,bg=background)    
button2  = Button(buttonpanel,text ='colour mode',  command = setModeColour,bg=background)    
button3  = Button(buttonpanel,text ='special mode', command = setModeSpecial,bg=background)    
button4  = Button(buttonpanel,text =str([[x,speciallist[x]] for x in range(len(speciallist))]).replace("[","").replace("],","\n").replace("]]","\n"), command = None,bg=background)    
button4a = Button(buttonpanel,text =str(Celly)+','+str(Cellx),command=None,bg = background)
button5  = Button(buttonpanel,text ='export level', command = Export,bg=background)    
button1.grid(row=0,column=0, sticky = W+E,columnspan=3 )
button2.grid(row=1,column=0, sticky = W+E,columnspan=3 )
button3.grid(row=2,column=0, sticky = W+E,columnspan=3 )
button4.grid(row=3,column=0, sticky = W+E,columnspan=3 )
button4a.grid(row=4,column=0, sticky = W+E,columnspan=3 )
button5.grid(row=5,column=0, sticky = W+E,columnspan=3 )
                                                                # it would be nice for this to work as a way of making the widget allways fill the screen however the width of the button is stored in text unit not in pixles and thereforth doesnt work.
canvas  = tk.Frame(master,background=background,width=SW-size,height=SH)   # create a canvas the screan size and colour it green
canvas.pack(side="left",fill="y",expand=False)
buttonpanel.pack(side="right",fill="y")



cells = {}
for i in range(height): #Rows
    for j in range(width): #Columns
        b = Entry(canvas, text="",width=2,bg=void,fg="pink")
        b.grid(row=i, column=j)
        cells[(j,i)] = b
def Interpolate(t, a, b): return a + t * (b - a)                                # t[0,1]  returns the value of t when mapped into the range a-b (if t is in the range 0-1)       
def Parameterize(x, a, b):                                                      # returns [0,1]  the opposite of interpolate - returns the value of x when mapped into the range 0-1 (given its in the range a-b) therwise limits the value to 0 or one so the overalll number cannot go over 1 or under 0
    if x < a: return 0                              
    if x > b: return 1                              
    return (x - a) / (b - a)                        
def Map  (x, a,b, c,d): return Interpolate(Parameterize(x, a, b), c, d)         # x[a,b] returns [c,d]
# main loop of the program
def isFloat(num):
    try:
        float(num)
        return True
    except ValueError:
        return False
while 1:     
    try:
        info = canvas.focus_get().grid_info()
        Cellx = info["row"]                                            #this is the program engine that calls all of the classes
        Celly = info["column"]    
        button4a.config(text=str(Celly)+','+str(Cellx))                                      #this is the program engine that calls all of the classes
    except AttributeError:pass
    if genorationmode == "height":
        for x in range(width):
            for y in range(height):
                data = cells[(x,y)].get()
                #outputHeight[x][y] = ''
                if data !='':
                    if isFloat(data):
                        colour = Map(float(data),-5,5, 0,255)
                        colour = '#{:02X}{:02X}{:02X}'.format(int(colour), int(colour), int(colour))
                        cells[(x,y)].configure(bg = colour )
                        if float(data) == float(data)//1: outputHeight[x][y]=int(data.replace(".",""))
                        else: outputHeight[x][y]=float(data)
                    else:
                        cells[(x,y)].configure(bg =warning)
                else:
                    outputHeight[x][y]=''
                if outputColour[x][y]!='':
                    cells[(x,y)].configure(bg =outputColour[x][y])
    if genorationmode == "colour":
        for x in range(width):
            for y in range(height):
                data = cells[(x,y)].get()
                #outputColour[x][y] = ''
                if data !='':
                    try:
                        cells[(x,y)].configure(bg = data )
                        outputColour[x][y] = data
                    except:
                        cells[(x,y)].configure(bg = warning )
                else:
                    if outputHeight[x][y]!='':
                        colour = Map(float(outputHeight[x][y]),-5,5, 0,255)
                        colour = '#{:02X}{:02X}{:02X}'.format(int(colour), int(colour), int(colour))
                        cells[(x,y)].configure(bg =colour)
                    else:
                        cells[(x,y)].configure(bg =void)
                    outputColour[x][y]=''
    if genorationmode == "special":
        for x in range(width):
            for y in range(height):
                data = cells[(x,y)].get()
                #outputSpecial[x][y]=''
                if data !='':
                    if isFloat(data) and float(data)<len(speciallist) and float(data)>=0:
                        cells[(x,y)].configure(bg = background )
                        outputSpecial[x][y] = int(float(data))
                    elif (data in speciallist):
                        cells[(x,y)].configure(bg = background )
                        for i in range(len(speciallist)):
                            if speciallist[i]==data:
                                outputSpecial[x][y] =[int(i)]
                    else:
                        cells[(x,y)].configure(bg = warning )
                        outputSpecial[x][y]=''
                else:
                #    cells[(x,y)].configure(bg = void)
                    outputSpecial[x][y]=''
    master.update()
master.mainloop()