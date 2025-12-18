 // get the css root so we can read styles and css variables and things
 var cube   = document.getElementById('controlledCube');
 var ground = document.getElementById('groundgrid'); 
 let notice = document.getElementById("noticetext");
const level={
        worldStartX:0,
        worldStartY:0,
        cameraDistance:0,
        defaultTopColour:'#aaa',
        defaultSideColour:'#aaa',
        worldText: [],
        noticeBoardText:{},
        holeInfo: {},
        WorldMap:[],
}

function setLevel(levelname){
    switch (levelname) {
        case 'intro':
            intro(level)
            break;
        case 'introTemple':
            introTemple(level)
            break;
        case 'sewer':
            sewer(level)
            break;
        case 'waterfall':
            waterfall(level)
            break;
        case 'test':
            test(level)
            break;
        default:
            console.error("setlevel defaulted")
            break;
    }
}
setLevel('intro') // set this to introTemple to skip the startrun

let worldX = level.worldStartX;
let worldY = level.worldStartY;
let worldZ = 0;

let isanimating = false;
let viewradius =24;  //#################################################  BROKEN NUMBER for some reason MUST be 24
//detects if device is in portrate mode
function detectLandscape(){
    if(document.body.clientHeight>document.body.clientWidth+200){
        alert("for the best experience please put your device in landscape mode");
    }
}
//on page load fill the map with all the cubes
function fillMap(zoffset=0) {

    let originalCube  = document.getElementById('cube');
    let originalLid   = document.getElementById('lid');
    let originalLeft  = document.getElementById('originalLeft');
    let originalRight = document.getElementById('originalRight');
    let hole          = document.getElementById('hole');
    let step          = document.getElementById('step');
    let stepdown      = document.getElementById('stepdown');
    let lampost       = document.getElementById('lampost');
    let modelWindow   = document.getElementById('window');
    let door          = document.getElementById('door');
    let tree          = document.getElementById('tree');
    let bridge1       = document.getElementById('bridge1');
    let bridge2       = document.getElementById('bridge2');
    let noticeBoard   = document.getElementById('notice board');
    let copy = 0;
    let x=0, y=0, z=0;
    let oldcubes = document.querySelectorAll('[id*="cube-"]')//get all instances of cloned cubes
    if (oldcubes.length !=0){
        for (cube of oldcubes){
            cube.remove()//delete them allll
        }
    }
    function Clone(a,b){//clone the correct object (found from world map[][][1]) into the correct location (a,b,Worldmap[a][b][0])-->(x,y,z) in the world
        let clonedcube = copy.cloneNode(true); // "deep clone
        let transformAdditions = ''
        switch (level.WorldMap[a][b][1]) {
            case  "hole":
                clonedcube = hole.cloneNode(true); // "deep" clone
                break;
            case  "step":
                clonedcube = step.cloneNode(true); // "deep" clone
                break;
            case  "stepdown":
                clonedcube = stepdown.cloneNode(true); // "deep" clone
                break;
            case  "lampost":
                clonedcube = lampost.cloneNode(true); // "deep" clone
                break;
            case  "window":
                clonedcube = modelWindow.cloneNode(true); // "deep" clone
                break;
            case  "door":
                clonedcube = door.cloneNode(true); // "deep" clone
                break;
            case  "tree":
                clonedcube = tree.cloneNode(true); // "deep" clone
                //clonedcube.tree.style.translate = "rotatez("+a**b+"deg)"; 
                clonedcube.children[0].style.transform = "rotatez("+53*(a+1)*(b+1)+"deg)"; 
                break;
            case  "rainbow":
                for (const child of clonedcube.children) {
                    child.style.animation  = "RainbowShift 500s infinite";
                }
                break;
            case  "noticeboard":
                clonedcube = noticeBoard.cloneNode(true); // "deep" clone
                break;
            case  "bridge1x1":
                clonedcube = bridge1.cloneNode(true); // "deep" clone
                break;
            case  "bridge1y1":
                clonedcube = bridge1.cloneNode(true); // "deep" clone
                transformAdditions = "rotatez(90deg)"; 
                break;
            case  "bridge1x2":
                clonedcube = bridge1.cloneNode(true); // "deep" clone
                transformAdditions = "rotatez(180deg)"; 
                break;
            case  "bridge1y2":
                clonedcube = bridge1.cloneNode(true); // "deep" clone
                transformAdditions = "rotatez(270deg)"; 
                break;
            case  "bridge2x1":
                clonedcube = bridge2.cloneNode(true); // "deep" clone
                break;
            case  "bridge2y1":
                clonedcube = bridge2.cloneNode(true); // "deep" clone
                transformAdditions = "rotatez(90deg)"; 
                break;
            case  "bridge2x2":
                clonedcube = bridge2.cloneNode(true); // "deep" clone
                transformAdditions = "rotatez(180deg)"; 
                break;
            case  "bridge2y2":
                clonedcube = bridge2.cloneNode(true); // "deep" clone
                transformAdditions = "rotatez(270deg)"; 
                break;
            }
        z = level.WorldMap[a][b][0];    
        if (z!=null){
            clonedcube.id = "cube-(" +(a)+','+(b)+')'; // there can only be one element per ID but they need to be findable
            clonedcube.style.transform = "translate3d("+(a-level.worldStartX)*15+"vh, "+(b-level.worldStartY)*15+"vh, "+String((z*15)+parseFloat(zoffset))+"vh)"+transformAdditions; //15vh is the size of the cubes lengths
            for (const child of clonedcube.children) {
                if (level.WorldMap[a][b][2]!=''){
                    child.style.background = level.WorldMap[a][b][2];
                }else if(child.classList.contains("front")){
                    child.style.background = level.defaultTopColour
                }else{
                    child.style.background = level.defaultSideColour
                }
            }
            copy.parentNode.appendChild(clonedcube);
        }
    }
    //fill the cubes by the borders of the world first to avoid array overflow errors
    
    for (let x = 0; x < level.WorldMap.length; x++) {
        y = level.WorldMap[x].length -1;
        copy = originalCube;
        Clone(x,y);    
    }
    for (let y = 0; y < level.WorldMap[0].length; y++) {
        copy = originalCube;
        Clone(1,y);    
    }
    // for all the other cubes in the map
    for (x = 0; x < level.WorldMap.length; x++) {
        for (y = 0; y < level.WorldMap[x].length-1; y++) {
    //        //if there is no cube next to it on either side then it MUST be a full cube   (all of the below account for z heights)
        let myheight = level.WorldMap[x][y][0];
        let cubeOnLeft=0;
        try{
            cubeOnLeft = level.WorldMap[x-1][y][0];
            if (level.WorldMap[x-1][y][1].includes('bridge')){cubeOnLeft-=1;}
        } //if the lists for the x coordinates are wildly inconsistent in length sometimes x-1 will not exist

        catch{ cubeOnLeft = null;}              //meaning that we handle it as an 'unmatchable' number i.e null this issue is impossible in the y direction 
        let cubeOnRight = level.WorldMap[x][y+1][0];
        if (level.WorldMap[x][y+1][1].includes('bridge')){cubeOnRight-=1}

        if ((level.WorldMap[x][y+1][0]!=myheight) && cubeOnLeft!=myheight){ 
            copy = originalCube;
        }else if (cubeOnRight!=myheight){ //if there is no cube to its +y side then it ONLY needs a right face and lid
            copy = originalRight;
        }else if (cubeOnLeft!=myheight){  //if there is no cube to its -x then it ONLY needs a left face and lid
            copy = originalLeft;
        }else if(cubeOnRight==myheight && cubeOnLeft==myheight){// if there is a cube on both sides then it only needs to be a lid
            copy = originalLid;
        }else{console.log("fillmap cube error (x,y,z) ("+x+','+y+','+level.WorldMap[x][y][0]+')')}//if its none of these then something broke

            
        
        Clone(x,y);  //create a clone of 'copy' at, x,y
        }       
    }
}
fillMap() //this was made a function as it will be neccecary to reuse when the world changes but for now is only called once on page load

//makes text or any other item visible between the start and end values


function setVisibility(locationx,locationy,radius){
    let startx= locationx-(radius*(1/2));
    let endx  = locationx+radius;
    let starty= locationy-radius/2;
    let endy  = locationy+radius/2;

    //find visibility for renderdistance
    for (let x = startx; x <= endx; x++) {
        for (let y = starty; y <= endy; y++) {
            let thing = document.getElementById("cube-("+x+","+y+")")
            if (thing!=null){
                if ((x>startx+1 && x<endx-1) && (y>starty+1 && y<endy-1)){
                    thing.style.display = "block";
                }else{thing.style.display = "none";}
            }
        }    
    }
    //create despawning effect based on camera location that treansparentifys object blocking view
    let fogdist = 20;
    let sin =Math.sin(parseFloat(root.style.getPropertyValue('--startAngleY'))* 3.14/180);
    let cos =Math.cos(parseFloat(root.style.getPropertyValue('--startAngleY'))* 3.14/180);
    let camerax=locationx-level.cameraDistance*cos;
    let cameray=locationy+level.cameraDistance*sin;
    let cubelist = [];
    let Nsteps= 16;
    for (let x = Math.max(0,locationx-fogdist); x <=Math.min(locationx+fogdist,level.WorldMap.length-1); x++) {
        for (let y = Math.max(0,locationy-fogdist); y <= Math.min(locationy+fogdist,level.WorldMap[x].length-1); y++) {
            let thing = document.getElementById("cube-("+x+","+y+")");
            let opacity = -2; //by default opacity wants to be 1 but as the world shifts with step we need extreem value
            let previous= 1;
            if (thing!=null){// if the thing exists
                let child = thing.children[0]; 
                if (child.children.length!=0){child=child.children[0];}//get its lowest level child
                previous =window.getComputedStyle(child).getPropertyValue("opacity");// and find out what its opacity is
                if (previous == '' || previous ==NaN || previous ==undefined){previous=0;}//if that dont work then something brokn
                
                if (level.WorldMap[x][y][0] >=1){
                    opacity=cos*(.9*(cameray-y))+sin*(.9*(x-camerax)); //this is the old function for opacity that creates a streight line, xy rotatable around the cubes center
                    if (x<=locationx){opacity=opacity*0.6}
                    if (y>=locationy){opacity=opacity*0.6}
                    opacity = (previous-opacity)/Nsteps; // set opacity change per step
                }
                cubelist.push(["cube-("+x+","+y+")",opacity,previous]);
            }
        }   
    }
    let step = 1;
    function setChildOpacity(thing,opacity){
        for (const child of thing.children){
            if (child.children.length==0){
                child.style.opacity=opacity;
            }else{
                setChildOpacity(child,opacity)
            }

        }
    }
    let id = setInterval(()=>{
        if (step<Nsteps){
            for (let i=0;i<cubelist.length;i++){    
                let thing = document.getElementById(cubelist[i][0]);
                setChildOpacity(thing,parseFloat(cubelist[i][2])-parseFloat((cubelist[i][1])*step))
            }
            step +=1
        }else{clearInterval(id)}
    },400/Nsteps);
}
setVisibility(worldX,worldY,viewradius)

// defines where each text block should be visible 
function textSpaceHandler(){
    for (let index = 0; index < level.worldText.length; index++) {
        setOpacity("text",index,level.worldText[index][0],level.worldText[index][1],level.worldText[index][2],level.worldText[index][3]);
    }
   
}
textSpaceHandler();

function setOpacity(item,index,startx,starty,endx,endy){
    let thing = document.getElementById(item);
    if ((worldX<startx || worldX>endx) || (worldY<starty || worldY>endy)){return;}
    if ((worldX>startx && worldX<endx) && (worldY>starty && worldY<endy)){
        thing.innerHTML = level.worldText[index][4]
        thing.classList.remove("hide");
        thing.classList.add("show");        
        thing.style.opacity = "1";
    } else {//this is called for every text block so it can ONLY be disabled if on the border line of a text area
        thing.classList.remove("show");
        thing.classList.add("hide");        
        thing.style.opacity = "0";
    } 
}



function setangle(angle){    //set rotation and angle for the css animations using css variables
    let angle2 = String(angle/2);
    angle = angle.concat("deg");
    angle2 = angle2.concat("deg"); //needed half angle for 50% on the css animation to make it look like cube roles properly over corner
    root.style.setProperty('--Newangle1',angle2);
    root.style.setProperty('--Newangle2',angle);
}

function Bounce(axis,direction){ //if the cube is inable to move in a direction it uses the bounce animation
    root.style.setProperty('--Newangle1',String(10*direction)+'deg')
    //do animation
    cube.classList.add('bounce'+axis);
    setTimeout(() => {cube.classList.remove('bounce'+axis);isanimating = false;}, 600);
    //test if bounced object is 'special' and requires treatment
    let thing= document.getElementById('cube-(' +(worldX)+','+(worldY)+')')
    //test for holes
    if (thing.classList.contains("hole")){
        thing = document.getElementById("worldspace");
        thing.classList.add("holefall");
        setTimeout(() => {
            setLevel(level.holeInfo[worldX+','+worldY]);
            worldX=level.worldStartX;
            worldY=level.worldStartY;
            fillMap();
            cube   = document.getElementById('controlledCube');
            ground = document.getElementById('groundgrid'); 
            notice = document.getElementById("noticetext");
            motionHandler('z',0);
        },1500)
        setTimeout(() => {
            thing.classList.remove("holefall");
            document.getElementById("worldspace").classList.remove("holefall");
        },4000)
    }
    //test for steps
    if(thing.classList.contains("step")){
        let increment= 1
        console.log(thing.children[0])
        if (thing.children[0].classList.contains("stepup")){ //if the step is up then move it down
            thing.children[0].classList.remove("stepup")
            increment=-1
        }else{
            thing.children[0].classList.add("stepup") //if the step is down move it up
            cube.classList.add("cubestepup");
        }
        setTimeout(()=>{
            cube.classList.remove("cubestepup");
            worldZ-=increment
            root.style.setProperty("--worldZ",(15*worldZ)+"vh")
            },200)
        for (let i = 0; i < level.WorldMap.length; i++) {// moves the whole world grid up or down by one
            for (let j = 0; j < level.WorldMap[i].length; j++) {
                level.WorldMap[i][j][0]-=increment
            }
        }
    }
    //test for notice boards
    switch (axis) {
        case "x":
            thing = document.getElementById("cube-(" +(worldX)+','+(worldY-direction)+')')
            if(thing.classList.contains("textholder")){
                notice.innerHTML = level.noticeBoardText[String(worldX)+","+String(worldY-direction)];
                //console.log(level.noticeBoardText[String(worldX)+","+String(worldY-direction)]);
                notice.classList.add("show");        
                notice.classList.remove("hide");
                notice.style.opacity = "1";
            }
            break;
            case "y":
                thing = document.getElementById("cube-(" +(worldX+direction)+','+(worldY)+')');
                if(thing.classList.contains("textholder")){
                    notice.innerHTML = level.noticeBoardText[String(worldX+direction)+","+String(worldY)];
                    console.log(level.noticeBoardText[String(worldX+direction)+","+String(worldY)]);
                    notice.classList.add("show");        
                    notice.classList.remove("hide");
                    notice.style.opacity = "1";
            }
            break;
                
        default:
            console.log("panik in the bounce function switch")
            break;
    }
    //animation end
}

function move(axis,direction){//move cube and world animations

    notice.classList.add("hide");        
    notice.classList.remove("show");
    notice.style.opacity = "0";
    root.style.setProperty('--Ground1',String(-405+direction*5)+'vh')  //define the variables for the css animation direction, and move the ground to the appropriet place
    root.style.setProperty('--Ground2',String(-405+direction*15)+'vh')
    //do animation
    cube.classList.add('rotate'+ axis); //add the animation class to the selected objects
    ground.classList.add('move'+ axis);
    setTimeout(() => {                     //after a set delay remove the classes and update the world coords
        ground.classList.remove('move'+axis);
        root.style.setProperty('--worldX',String(15*(level.worldStartX-worldX))+'vh');
        root.style.setProperty('--worldY',String(15*(level.worldStartY-worldY))+'vh');
        cube.classList.remove('rotate'+axis);
    }, 400);
    textSpaceHandler()//update displayed text
    setVisibility(worldX,worldY,viewradius)
    //console.log(worldX,worldY); // print current world coord
    setTimeout(() => {
        isanimating = false;
    },500);// after even more time make the animatino refreshable
    //animtion end
    console.log("world (x,y)  ("+worldX+','+worldY+')')
}
function motionHandler(axis,direction){   //decides if movement resultes in cube bouncing, or moving tile
    if (!isanimating){                    // only allow one movement at a time
        isanimating = true;
        let angle = 0;                   
        setangle(String(angle+90*direction));
        try{
            if (axis == "x"){//determine which keypress increments what world coordinate & if there is a collision because of it
                if(level.WorldMap[worldX][worldY-direction][0]==0){worldY -=direction;}
                else if(level.WorldMap[worldX][worldY-direction][0]==-1 && level.WorldMap[worldX][worldY-direction][1]=='step'){
                    worldY -=direction;
                    move(axis,direction);
                    return}
                else{Bounce(axis,direction); return}
            }
        }catch(err){//if it is bouncing of the edge of the world , i.e WorldMap it will make an overflow error, which is not a walkable tile, so bounce
            Bounce(axis,direction);
            return
        }    
        try{
            if(axis =="y"){ //same for y, but backwards because the y coord is negative, for some reason.
                direction = -direction;
                if(level.WorldMap[worldX-direction][worldY][0]==0){
                    worldX -=direction;
                }else if(level.WorldMap[worldX-direction][worldY][0]==-1 && level.WorldMap[worldX-direction][worldY][1]=='step'){
                    worldX -=direction
                    move(axis,direction);
                    return;
                }else{
                    direction =-direction;
                    Bounce(axis,direction)
                    return
                }
            }
        }catch(err){
            direction =-direction;
            Bounce(axis,direction)
            return
        }
        move(axis,direction)
    }
} 

//keypress input detection
document.addEventListener('keydown',keypress);
function keypress(event){            
    const key = event.code; // aquire keypress
    const callback = {      // object literal switch
        "ArrowLeft"  : leftHandler,
        "KeyA"       : leftHandler,
        "ArrowRight" : rightHandler,
        "KeyD"       : rightHandler,
        "ArrowUp"    : upHandler,
        "KeyW"       : upHandler,
        "ArrowDown"  : downHandler,
        "KeyS"       : downHandler,
    }[key]
        callback?.()    
}
function upHandler()   {motionHandler("y",+1);}
function rightHandler(){motionHandler("x",-1);}
function downHandler() {motionHandler("y",-1);}
function leftHandler() {motionHandler("x",+1);} // convert switch outcome to coordinate movement
let landscapeIntervalId = setInterval(()=>{detectLandscape}, 10000); // find if user is in landscape mode once every 10s
setTimeout(() => {document.getElementById("textspace").style.visibility="visible";},1000);//enables texstspace in run
setTimeout(() => {
    let a = document.getElementById("RenderSpace");
    a.style.animation="Show 5s";
    a.style.opacity = "1";
},800);//enables renderspace in run after loading
