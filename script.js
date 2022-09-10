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
createGrid() 
const handleGameGrid = () => {
    for(let i=0; i < gameGrid.length; i++){ //cycle through all the elements in game grid array 
        gameGrid[i].draw()
    }
}
createGrid() 
// console.log(gameGrid)

// projectiles 
// defenders 
// heroes 
// enemies 
// resources 
// utilities 
const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'blue'
    ctx.fillRect(0, 0, controlsBar.width, controlsBar.height) 
    handleGameGrid() 
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