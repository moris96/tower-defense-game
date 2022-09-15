console.log('js connected');
//reminder: normal functions are constructors ; arrow functions are only callable 

//canvas 
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 900;
canvas.height = 600;

//global vars 
const cellSize = 100;
const cellGap = 3;
let numberMoney = 300; 
let weakVilliansInterval = 600; 
let frame = 0;
let gameOver = false;
let score = 0;
const winningScore = 40; //leave for now for dev purposes might increase depends on time and stuff ; first level should be 50 

//global arrays 
const gameGrid = [];
const heroes = [];
const weakVillians = [];
const weakVillianPositions = [];
const lasers = [];
const money = [];
const floatingMessages = [];


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
class Lasers {
    constructor(x,y){
        this.x = x
        this.y = y
        this.width = 10
        this.height = 20
        this.power = 20 
        this.speed = 5
    }
    update(){
        this.x += this.speed
    }
    draw(){
        ctx.fillStyle = 'black'
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2)
        ctx.fill()
    }
}

function handleLasers(){
    for(let i=0; i < lasers.length; i++){
        lasers[i].update()
        lasers[i].draw()
        for(let j=0; j < weakVillians.length; j++){
            if(weakVillians[j] && lasers[i] && collision(lasers[i], weakVillians[j])){
                weakVillians[j].health -= lasers[i].power
                lasers.splice(i,1)
                i--;
            }
        }
        if(lasers[i] && lasers[i].x > canvas.width - cellSize){
            lasers.splice(i,1) 
            i-- 
        }
    }
}




//heroes 
class Hero {
    constructor(x,y){
        this.x = x
        this.y = y 
        this.width = cellSize - cellGap * 2
        this.height = cellSize - cellGap * 2
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
    update(){
        if (this.shooting){
            this.timer++;
            if (this.timer % 100 === 0){
                lasers.push(new Lasers(this.x + 70, this.y + 50));
            }
        } else {
            this.timer = 0;
        }
    }
}


function handleHeroes(){
    for(let i=0; i < heroes.length; i++){
        heroes[i].draw();
        heroes[i].update();
        if(weakVillianPositions.indexOf(heroes[i].y) !== -1){
            heroes[i].shooting = true
        } else{
            heroes[i].shooting = false
        }
        for(let j=0; j < weakVillians.length; j++){
            if(heroes[i] && collision(heroes[i], weakVillians[j])){
                weakVillians[j].movement = 0 
                heroes[i].health -= 1
            }
            if(heroes[i] && heroes[i].health <= 0){
                heroes.splice(i,1) 
                i--
                weakVillians[j].movement = weakVillians[j].speed
            }
        }
    }
}


//floating messages 
class floatingMessage {
    constructor(value, x, y, size, color){
        this.value = value
        this.x = x 
        this.y = y 
        this.size = size 
        this.lifeSpan = 0
        this.color = color
        this.opacity = 1
    }
    update(){
        this.y -= 0.3
        this.lifeSpan += 1
        if(this.opacity > 0.03) this.opacity -= 0.03
    }
    draw(){
        this.globalAlpha = this.opacity
        ctx.fillStyle = this.color 
        ctx.font = this.size + 'px Blade Runner Movie Font'
        ctx.fillText(this.value, this.x, this.y)
        ctx.globalAlpha = 1 
    }
}
function handleFloatingMessages(){
    for(let i=0; i < floatingMessages.length; i++){
        floatingMessages[i].update()
        floatingMessages[i].draw()
        if(floatingMessages[i].lifeSpan >= 50){
            floatingMessages.splice(i, 1)
            i--;
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
        this.speed = Math.random() * 0.2 + 0.8 //change to 0.4 later once everything work 
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
        if(weakVillians[i].health <= 0){
            let gainedResources = weakVillians[i].maxHealth/10;
            floatingMessages.push(new floatingMessage('+' + gainedResources, weakVillians[i].x, weakVillians[i].y, 30, 'black'))
            floatingMessages.push(new floatingMessage('+' + gainedResources, 250, 50, 30, 'gold'))
            numberMoney += gainedResources;
            score += gainedResources;
            const findThisIndex = weakVillianPositions.indexOf(weakVillians[i].y);
            weakVillianPositions.splice(findThisIndex, 1);
            weakVillians.splice(i, 1);
            i--;
          }
    }
    if(frame % weakVilliansInterval === 0 && score < winningScore){
        let verticalPosition = Math.floor(Math.random() * 5 + 1) * cellSize + cellGap
        weakVillians.push(new WeaksV(verticalPosition))
        weakVillianPositions.push(verticalPosition)
        if(weakVilliansInterval > 120) weakVilliansInterval -= 50 
    }
}





//strong villians strong "Strongs"
//final boss called "Boss"





//money 
const amounts = [20, 50, 80] //might change later depends 

class Money {
    constructor(){
        this.x = Math.random() * (canvas.width - cellSize)
        this.y = (Math.floor(Math.random() * 5) + 1) * cellSize + 25
        this.width = cellSize * 0.6
        this.height = cellSize * 0.6
        this.amount = amounts[Math.floor(Math.random() * amounts.length)] 
    }
    draw(){
        ctx.fillStyle = 'yellow'
        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = 'black'
        ctx.font = '20px Blade Runner Movie Font'
        ctx.fillText(this.amount, this.x + 15, this.y + 25)
    }
}
function handleMoney(){
    if(frame % 500 === 0 && score < winningScore){
        money.push(new Money())
    }
    for(let i=0; i < money.length; i++){
        money[i].draw();
        if(money[i] && mouse.x && mouse.y && collision(money[i], mouse)){
            numberMoney += money[i].amount
            floatingMessages.push(new floatingMessage('+' + money[i].amount, money[i].x, money[i].y, 30, 'black'))
            floatingMessages.push(new floatingMessage('+' + money[i].amount, 250, 50, 30, 'gold'))
            money.splice(i, 1)
            i--;
        }
    }
}



//utilities 
function handleGameStatus(){
    ctx.fillStyle = 'gold'
    ctx.font = '30px Blade Runner Movie Font'
    ctx.fillText('Score: ' + score, 20, 35) 
    ctx.fillText('Money: ' + numberMoney, 20, 75) 
    if(gameOver){
        ctx.fillStyle = 'gold'
        ctx.font = '60px Blade Runner Movie Font'
        ctx.fillText('Game Over! You lose!', 95, 300) 

        // document.getElementById('reset').addEventListener('click', () => {
        //     ctx.clearRect(canvas)
        // }, false) //will fix this problem later just want to make the game work for now 
    }
    if(score > winningScore && weakVillians.length === 0){
        ctx.fillStyle = 'gold'
        ctx.font = '60px Blade Runner Movie Font'
        ctx.fillText('Level 1 complete!', 130, 300)
        ctx.font = '30px Blade Runner Movie Font'
        ctx.fillText('You win with: ' + score + ' ' + 'points!', 134, 340) 
    }
}


canvas.addEventListener('click', () => {
    const gridPositionX = mouse.x - (mouse.x % cellSize) + cellGap
    const gridPositionY = mouse.y - (mouse.y % cellSize) + cellGap
    if(gridPositionY < cellSize) return; 
    for(let i=0; i < heroes.length; i++){
        if(heroes[i].x === gridPositionX && heroes[i].y === gridPositionY) return;
    }
    let heroesCost = 100 
    if(numberMoney >= heroesCost){
        heroes.push(new Hero(gridPositionX, gridPositionY))
        numberMoney -= heroesCost
    } else{
        floatingMessages.push(new floatingMessage('mo money mo problems', mouse.x, mouse.y, 20, 'blue')); 
    }
});




const anime = () => {
    ctx.clearRect(0,0, canvas.width, canvas.height)
    ctx.fillStyle = 'blue'
    ctx.fillRect(0,0, controlsBar.width, controlsBar.height)
    handleGameBoard();
    handleHeroes();
    handleMoney();
    handleLasers();
    handleWeakVillians();
    handleGameStatus();
    handleFloatingMessages();
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

window.addEventListener('resize', () => {
    canvasPosition = canvas.getBoundingClientRect();
})