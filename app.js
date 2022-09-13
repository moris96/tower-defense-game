console.log('js connected')

//canvas 
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.width = 900
canvas.height = 600 

//global vars 
const cellSize = 100 
const cellGap = 3
let numberMoney = 300 
let villiansInterval = 600 
let frame = 0
let gameOver = false
const gameGrid = []
const heroes = []
const villians = []
const villianPositions = []
const lasers = []

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

//game board 
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
function gameBoard(){
    for(let y=cellSize; y < canvas.height; y+=cellSize){
        for(let x=0; x < canvas.width; x+=cellSize){
            gameGrid.push(new Cell(x,y))
        }
    }
}
gameBoard();

function handleGameBoard(){
    for(let i=0; i < gameGrid.length; i++){
        gameGrid[i].draw()
    }
}



//lasers 
//weak villians 
//strong villians 
//final boss 
//money 
//utilities 


//heroes 
class Hero {
    constructor(x,y){
        this.x = x
        this.y = y 
        this.width = cellSize
        this.height = cellSize
        this.shooting = false 
        this.health = 100 
        this.lasers = [] 
        this.timer = 0 
    }
    draw(){
        ctx.fillStyle = 'blue'
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = 'gold'
        ctx.font = '30px Blade Runner Movie Font'
        ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 25)
    }
}
canvas.addEventListener('click', () => {
    const gridPositionX = mouse.x - (mouse.x % cellSize)
    const gridPositionY = mouse.y - (mouse.y % cellSize)
    if(gridPositionY < cellSize) return; 
    let heroesCost = 100 
    if(numberMoney > heroesCost){
        heroes.push(new Hero(gridPositionX, gridPositionY))
        numberMoney -= heroesCost
    }
})

function handleHeroes(){
    for(let i=0; i < heroes.length; i++){
        heroes[i].draw();
    }
}






const anime = () => {
    ctx.clearRect(0,0, canvas.width, canvas.height)
    ctx.fillStyle = 'blue'
    ctx.fillRect(0,0, controlsBar.width, controlsBar.height)
    handleGameBoard();
    handleHeroes();
    requestAnimationFrame(anime);
}
anime();


function collision(first, second){
    if (    !(  first.x > second.x + second.width ||
                first.x + first.width < second.x ||
                first.y > second.y + second.height ||
                first.y + first.height < second.y)
    ) {
        return true;
    }
} 