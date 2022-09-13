console.log('js connected')
//reminder: normal functions are constructors ; arrow functions are only callable 

//canvas 
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.width = 900
canvas.height = 600 

//global vars 
const cellSize = 100 
const cellGap = 3
let numberMoney = 300 
let weakVilliansInterval = 600 
let frame = 0
let gameOver = false

//global arrays 
const gameGrid = []
const heroes = []
const weakVillians = []
const weakVillianPositions = []
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
        ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 30)
    }
}
canvas.addEventListener('click', () => {
    const gridPositionX = mouse.x - (mouse.x % cellSize)
    const gridPositionY = mouse.y - (mouse.y % cellSize)
    if(gridPositionY < cellSize) return; 
    for(let i=0; i < heroes.length; i++){
        if(heroes[i].x === gridPositionX && heroes[i].y === gridPositionY) return;
    }
    let heroesCost = 100 
    if(numberMoney >= heroesCost){
        heroes.push(new Hero(gridPositionX, gridPositionY))
        numberMoney -= heroesCost
    }
})

function handleHeroes(){
    for(let i=0; i < heroes.length; i++){
        heroes[i].draw();
        for(let j=0; j < weakVillians.length; j++){
            if(collision(heroes[i], weakVillians[j])){
                weakVillians[j].movement = 0 
                heroes[i].health -= 0.2 
            }
            if(heroes[i] && heroes[i].health <= 0){
                heroes.splice(i,1) 
                i--
                weakVillians[j].movement = weakVillians[j].speed
            }
        }
    }
}





//weak villians called "WeaksV"
class WeaksV {
    constructor(verticalPosition){
        this.x = canvas.width
        this.y = verticalPosition
        this.width = cellSize - cellGap * 2
        this.height = cellSize - cellGap * 2
        this.speed = Math.random() * 0.2 + 2 //change to 0.4 later once everything work 
        this.movement = this.speed
        this.health = 100
        this.maxHealth = this.health
    }
    update(){
        this.x -= this.movement
    }
    draw(){
        ctx.fillStyle = 'red'
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = 'black'
        ctx.font = '30px Blade Runner Movie Font'
        ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 30)
    }
}
function handleWeakVillians(){
    for(let i=0; i < weakVillians.length; i++){
        weakVillians[i].update()
        weakVillians[i].draw()
        if(weakVillians[i].x < 0){
            gameOver = true
        }
    }
    if(frame % weakVilliansInterval === 0){
        let verticalPosition = Math.floor(Math.random() * 5 + 1) * cellSize
        weakVillians.push(new WeaksV(verticalPosition))
        weakVillianPositions.push(verticalPosition)
        if(weakVilliansInterval > 120) weakVilliansInterval -= 50 
    }
}





//strong villians strong "Strongs"
//final boss called "Boss"
//money 
//lasers 




//utilities 
function handleGameStatus(){
    ctx.fillStyle = 'gold'
    ctx.font = '30px Blade Runner Movie Font'
    ctx.fillText('Money: ' + numberMoney, 20, 55) 
    if(gameOver){
        ctx.fillStyle = 'gold'
        ctx.font = '60px Blade Runner Movie Font'
        ctx.fillText('GAME OVER!', 135, 330) 
    }
}





const anime = () => {
    ctx.clearRect(0,0, canvas.width, canvas.height)
    ctx.fillStyle = 'blue'
    ctx.fillRect(0,0, controlsBar.width, controlsBar.height)
    handleGameBoard();
    handleHeroes();
    handleWeakVillians();
    handleGameStatus();

    frame++;
    if(!gameOver) requestAnimationFrame(anime);
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