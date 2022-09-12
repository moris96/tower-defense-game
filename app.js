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