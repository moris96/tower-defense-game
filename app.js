console.log('js connected')

//canvas 
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.width = 900
canvas.height = 600 

//global vars 
const cellSize = 100 
const cellGap = 3
let numberResources = 300 
let enemiesInterval = 600 
let frame = 0
let gameOver = false
const gameGrid = []
const defenders = []
const enemies = []
const enemyPositions = []
const projectiles = []

//mouse
const mouse = {
    x: 10,
    y: 10, 
    width: 0.1, 
    height: 0.1,
}

let canvasPosition = canvas.getBoundingClientRect()

canvas.addEventListener('mousemove', (evt) => {
    mouse.x = evt.x - canvasPosition.left
    mouse.y = evt.y - canvasPosition.top
})
canvas.addEventListener('mouseleave', () => {
    mouse.x = undefined
    mouse.y = undefined
})

//game board & game board 
const controlsBar = {
    width: canvas.width,
    height: cellSize,
}

class Cell {
    constructor(x,y){
        this.x = x
        this.y = y
        this.width = cellSize
        this.height = cellSize
    }
    draw(){
        if(mouse.x && mouse.y && collision(this, mouse)){
            ctx.strokeStyle = 'black'
            ctx.strokeRect(this.x, this.y, this.width, this.height)
        }
    }
}
const createGrid = () => {
    for(let y=cellSize; y < canvas.height; y+=cellSize){
        for(let x=0; x < canvas.width; x+=cellSize){
            gameGrid.push(new Cell(x,y))
        }
    }
}
createGrid()




const animate = () => {
    ctx.clearRect(0,0, canvas.width, canvas.height)
    ctx.fillStyle = 'blue'
    ctx.fillRect(0,0, controlsBar.width, controlsBar.height)
}
animate();