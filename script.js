console.log('I am real Super Saiyan')

//canvas 
const canvas = document.getElementById('canvas-1')
const ctx = canvas.getContext('2d') //context 
canvas.width = 900
canvas.height = 600 


// global variables 
const cellSize = 100 //100px
const cellGap = 3 //3x3 px 
let numberResources = 300
let enemiesInterval = 600
let frame = 0
let gameOver = false

//global arrays 
const gameGrid = [] 
const defenders = []
const enemies = [] 
const enemyPositions = []
const projectiles = []

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

//blueprint 
class Cell { 
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
    for(let y = cellSize; y < canvas.height; y += cellSize){ //each time it runs it will change row (vertical values)
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
class Projectiles {
    constructor(x, y){
        this.x = x
        this.y = y
        this.width = 10
        this.height = 10
        this.power = 20 //for now, depends on how strong certain enemies are and stuff 
        this.speed = 5
    }
    update(){
        this.x =+ this.speed //move projectiles to the right 
    }
    draw(){
        ctx.fillStyle = 'black'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.width, 0, Math.PI*2) //draws a circle 
        ctx.fill()
    }
}

const handleProjectiles = () => {
    for(let i=0; i < projectiles.length; i++){
        projectiles[i].update();
        projectiles[i].draw();
        
        if(projectiles[i] && projectiles[i].x > canvas.width - cellSize){
            projectiles.splice(i, 1);
            i--;
        }
        console.log('projectiles ' + projectiles.length)
    }
}


// defenders 
class Defender {
    constructor(x, y){
        this.x = x
        this.y = y 
        this.width = cellSize - cellGap * 2
        this.height = cellSize - cellGap * 2
        this.shooting = false //defenders only shoot when they detect enemies 
        this.health = 100 //defenders loose health when colliding with enemies 
        this.projectiles = []
        this.timer = 0 
    }
    draw(){
        ctx.fillStyle = 'blue'
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = 'gold'
        ctx.font = '30px Blade Runner Movie Font' 
        ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 30) //display health meter 
    }
    update(){
        this.timer++
        if(this.timer % 100 === 0){
            projectiles.push(new Projectiles(this.x, this.y)) //every 100 frames push projectiles to projectiles array 
        }
    }
}
canvas.addEventListener('click', () => {
    const gridPositionX = mouse.x - (mouse.x % cellSize) - cellGap //250-50 (value of closest horizontal grid position to the left)
    const gridPositionY = mouse.y - (mouse.y % cellSize) - cellGap
    if(gridPositionY < cellSize) return; //nothing will be placed on top highlighted area, function will just return and end 
    for(let i=0; i < defenders.length; i++){
        if(defenders[i].x === gridPositionX && defenders[i].y === gridPositionY) return; //this prevents placing new defender on top of existing one
    }
    let defendersCost = 100 //cost of defender (later might change it to have cheaper or more expensive units)
    if(numberResources >= defendersCost){
        defenders.push(new Defender(gridPositionY, gridPositionX)) //creates a new blank defender object & checking if enough resources to place new defender
        numberResources -= defendersCost //detuct defender cost from number of resources 
    }
})

const handleDefenders = () => { //cycles through all elements in defenders array 
    for(let i=0; i < defenders.length; i++){
        defenders[i].draw();
        defenders[i].update();
        for (let j=0; j < enemies.length; j++){
            if(collision(defenders[i], enemies[j])){
                enemies[j].movement = 0;
                defenders[i].health -= 1; //how fast a defender loses health 
            }
            if(defenders[i] && defenders[i].health <= 0){
                defenders.splice(i, 1)
                i--;
                enemies[j].movement = enemies[j].speed; //enemies move at original speed after collision after they kill defender 
            }
        }
    }
}


// heroes 
// enemies 
class Enemy {
    constructor(verticalPosition){
        this.x = canvas.width //each enemy will spawn just behind right edge of canvas 
        this.y = verticalPosition
        this.width = cellSize
        this.height = cellSize
        this.speed = Math.random() * 0.2 + 2 //random number between 0.4 & 0.6. might change later depends on difficulty 
        this.movement = this.speed //speed of enemies will change to 0 when colliding with defenders then move again if they defeat defenders 
        this.health = 100
        this.maxHealth = this.health //upon death enemies will reward recources depending on their max health 
    }
    update(){
        this.x -= this.movement //enemies walk to the left 
    }
    draw(){
        ctx.fillStyle = 'red' //drawing enemies 
        ctx.fillRect(this.x, this.y, this.width, this.height) 
        ctx.fillStyle = 'black' 
        ctx.font = '30px Blade Runner Movie Font' 
        ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 30) //display health meter 
    }
}

const handleEnemies = () => {
    for(let i=0; i < enemies.length; i++){
        enemies[i].update()
        enemies[i].draw()
        if(enemies[i].x < 0){
            gameOver = true //game will freeze and display game over message 
        }
    }
    if(frame % enemiesInterval === 0){
        let verticalPosition = Math.floor(Math.random() * 5 + 1) * cellSize
        enemies.push(new Enemy(verticalPosition))
        enemyPositions.push(verticalPosition) //every 600 frames a new enemy will spawn and store in verticlePosition array 
        if(enemiesInterval > 120) enemiesInterval -= 50 //affects game difficulty in big ways! 
    }
}

// resources 
// utilities 
const handleGameStatus = () => {
    ctx.fillStyle = 'gold'
    ctx.font = '30px Blade Runner Movie Font'
    ctx.fillText('Resources: ' + numberResources, 20, 55)
    if(gameOver){
        ctx.fillStyle = 'gold'
        ctx.font = '60px Blade Runner Movie Font'
        ctx.fillText('GAME OVER!', 135, 330) 
    }
}

const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'blue';
    ctx.fillRect(0, 0, controlsBar.width, controlsBar.height);
    handleGameGrid();
    handleDefenders();
    handleProjectiles();
    handleEnemies();
    handleGameStatus();
    frame++;
    if(!gameOver) requestAnimationFrame(animate); //creates an animation loop (recursion) need to fix this later!
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