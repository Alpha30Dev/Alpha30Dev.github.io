const canvas = document.querySelector("canvas")
const context = canvas.getContext('2d')

canvas.width = 1197;
canvas.height = 567;

let box = 21

let snake = [];
snake[0] = { x: Math.floor(canvas.width/2/box)*box, y: Math.floor(canvas.height/2/box)*box }

let food = {
    x: Math.floor(Math.random() * (canvas.width/box)) * box,
    y: Math.floor(Math.random() * (canvas.height/box)) * box
}

let score = 0
let d
let seconds = 59
let gameOver = false
let lastDirection = null
let lastFoodTime = Date.now();

const scoreDisplay = document.querySelector('.top-screen span:nth-child(3)');
const timeDisplay = document.querySelector('.top-screen span:nth-child(2)');

document.addEventListener("keydown", direction);

function direction(event){
    event.preventDefault();
    let key = event.keyCode;
    if(key == 37 && lastDirection != "RIGHT" && d != "RIGHT"){
        d = "LEFT";
    } else if (key == 39 && lastDirection != "LEFT" && d != "LEFT"){
        d = "RIGHT";
    } else if (key == 40 && lastDirection != "UP" && d != "UP"){
        d = "DOWN";
    } else if (key == 38 && lastDirection != "DOWN" && d != "DOWN"){
        d = "UP";
    }
}

function collision(head, array){
    for(let i = 0; i < array.length; i++){
        if(head.x == array[i].x && head.y == array[i].y){
            return true;
        }
    }
    return false;
}

function draw(){
    context.clearRect(0, 0, canvas.width, canvas.height)
    
    scoreDisplay.textContent = `Score : ${score}`;
    timeDisplay.textContent = `Time : ${seconds > 9 ? "" : "0"}${seconds}s`;
    
    if (gameOver) {
        clearInterval(game);
        return;
    }
    
    for(let i = 0; i < snake.length; i++){
        context.fillStyle = (i == 0) ? "green" : "lightgreen"
        context.fillRect(snake[i].x, snake[i].y, box, box)
        context.strokeStyle = "green"
        context.strokeRect(snake[i].x, snake[i].y, box, box)
    }
    
    context.fillStyle = "red"
    context.fillRect(food.x, food.y, box, box)
    
    let snakeX = snake[0].x
    let snakeY = snake[0].y
    
    if(d == "LEFT") {
        snakeX -= box;
        lastDirection = "LEFT";
    }
    if(d == "UP") {
        snakeY -= box;
        lastDirection = "UP";
    }
    if(d == "RIGHT") {
        snakeX += box;
        lastDirection = "RIGHT";
    }
    if(d == "DOWN") {
        snakeY += box;
        lastDirection = "DOWN";
    }
    
    if(snakeX == food.x && snakeY == food.y){
        const currentTime = Date.now();
        const timeDifference = (currentTime - lastFoodTime) / 1000;
        
        score += (timeDifference < 2) ? 30 : 20;
        
        food = {
            x: Math.floor(Math.random() * (canvas.width/box)) * box,
            y: Math.floor(Math.random() * (canvas.height/box)) * box
        }
        lastFoodTime = currentTime;
    } else {
        snake.pop()
    }
    
    let newHead = {
        x: snakeX,
        y: snakeY
    }

    if(snakeX < 0) {
        newHead.x = canvas.width - box;
    } else if(snakeX >= canvas.width) {
        newHead.x = 0;
    }

    if(snakeY < 0) {
        newHead.y = canvas.height - box;
    } else if(snakeY >= canvas.height) {
        newHead.y = 0;
    }
    
    if(collision(newHead, snake) || seconds === 0){
        clearInterval(game);
        gameOver = true;
        return;
    }
    
    snake.unshift(newHead)
    
    scoreDisplay.textContent = `Score : ${score}`;
    timeDisplay.textContent = `Time : ${seconds > 9 ? "" : "0"}${seconds}s`;
}

function startTimer() {
    setInterval(() => {
        if (!gameOver && seconds > 0) {
            seconds--;
            timeDisplay.textContent = `Time : ${seconds > 9 ? "" : "0"}${seconds}s`;
        }
    }, 1000);
}

let game = setInterval(draw, 50);
startTimer();