console.log('I am real Super Saiyan')

//canvas 
const canvas = document.getElementById('canvas-1')
const ctx = canvas.getContext('2d') //context 
canvas.width = 900
canvas.height = 600 


// global variables 
const cellSize = 100 //100px
const cellGap = 3 //3x3 px 
const gameGrid = [] 
const defenders = []
let numberResources = 300

//mouse (hovering over)
const mouse = {
    x: 10,
    y: 10,
    width: 0.1,
    height: 0.1,
}

let canvasPosition = canvas.getBoundingClientRect() //returns a DOM rectangle object. size of an element and its position 
// console.log(canvasPosition)
canvas.addEventListener('mousemove', (evt) => {
    mouse.x = evt.x - canvasPosition.left //clicked mousemove starts from top left of canvas 
    mouse.y = evt.y - canvasPosition.top 
}) 
canvas.addEventListener('mouseleave', () => {
    mouse.x = undefined //this leaves all cells invisible and only 1 to light up when we hover over it
    mouse.y = undefined 
})

// game board 
const controlsBar = {
    width: canvas.width,
    height: cellSize, 
}

class Cell { //blueprint 
    constructor(x, y){
        this.x = x
        this.y = y 
        this.width = cellSize
        this.height = cellSize
    }
    draw(){
        if(mouse.x && mouse.y && collision(this, mouse)){
            ctx.strokeStyle = 'black' //border color of cells 
            ctx.strokeRect(this.x, this.y, this.width, this.height)
        }
    }
}

const createGrid = () => {
    for(let y = cellSize; y < canvas.height; y+= cellSize){ //each time it runs it will change row (vertical values)
        for(let x=0; x < canvas.width; x += cellSize){ //assigning horizontal values 
            gameGrid.push(new Cell(x, y)) //creates new cell from class constructor 
        }
    } 
}
createGrid();

const handleGameGrid = () => {
    for(let i=0; i < gameGrid.length; i++){ //cycle through all the elements in game grid array 
        gameGrid[i].draw()
    }
}
// console.log(gameGrid)

// projectiles 
// defenders 
class Defender {
    constructor(x, y){
        this.x = x
        this.y = y 
        this.width = cellSize
        this.height = cellSize
        this.shooting = false //defenders only shoot when they detect enemies 
        this.health = 100 //defenders loose health when colliding with enemies 
        this.projectiles = []
        this.timer = 0 
    }
    draw(){
        ctx.fillStyle = 'blue'
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = 'gold'
        ctx.font = '30px Arial' 
        ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 30) //display health meter 
    }
}
canvas.addEventListener('click', () => {
    const gridPositionX = mouse.x - (mouse.x % cellSize) //250-50 (value of closest horizontal grid position to the left)
    const gridPositionY = mouse.y - (mouse.y % cellSize)
    if(gridPositionY < cellSize) return //nothing will be placed on top highlighted area, function will just return and end 
    let defendersCost = 100 //cost of defender (later might change it to have cheaper or more expensive units)
    if(numberResources >= defendersCost){
        defenders.push(new Defender(gridPositionY, gridPositionX)) //creates a new blank defender object & checking if enough resources to place new defender
        numberResources -= defendersCost //detuct defender cost from number of resources 
    }
})

const handleDefenders = () => { //cycles through all elements in defenders array 
    for(let i=0; i < defenders.length; i++){
        defenders[i].draw();
    }
}
handleDefenders(); //will keep this for now 


// heroes 
// enemies 
// resources 
// utilities 
const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'blue'
    ctx.fillRect(0, 0, controlsBar.width, controlsBar.height) 
    handleGameGrid();
    handleDefenders();
    requestAnimationFrame(animate) //creates an animation loop (recursion) 
}
animate(); 

//collision function between 2 rectangles 
function collision(first, second){
    if (    !(  first.x > second.x + second.width ||
                first.x + first.width < second.x ||
                first.y > second.y + second.height ||
                first.y + first.height < second.y)
    ) {
        return true;
    }
} 