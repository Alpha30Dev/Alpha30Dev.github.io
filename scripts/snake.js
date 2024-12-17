const canvas = document.querySelector("canvas")
const context = canvas.getContext('2d')

let box = 20

let snake = [];
snake[0] = { x: 10*box, y: 10*box }

let food = {
    x: Math.floor(Math.random() * 15 + 1) * box,
    y: Math.floor(Math.random() * 15 + 1) * box
}

let score = 0
let d
let seconds = 59
let gameOver = false

document.addEventListener("keydown", direction);

function direction(event){
    let key = event.keyCode;
    if(key == 37 && d !="RIGHT"){
        d = "LEFT";
    } else if (key == 39 && d !="LEFT"){
        d = "RIGHT";
    } else if (key == 40 && d !="UP"){
        d = "DOWN";
    } else if (key == 38 && d !="DOWN"){
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
    context.clearRect(0, 0, 400, 400)
    
    context.fillStyle = "red"
    context.font = "30px Arial"
    context.fillText(score, 2*box, 1.6*box)
    
    context.fillStyle = seconds < 11 ? "red" : "green"
    context.font = "20px Arial"
    context.fillText(`Temps: ${seconds > 9 ? "" : "0"}${seconds}s`, 14*box, 1.6*box)
    
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
    
    if(d == "LEFT") snakeX -= box
    if(d == "UP") snakeY -= box
    if(d == "RIGHT") snakeX += box
    if(d == "DOWN") snakeY += box
    
    if(snakeX == food.x && snakeY == food.y){
        score++;
        food = {
            x: Math.floor(Math.random() * (400/box - 2)) * box,
            y: Math.floor(Math.random() * (400/box - 2)) * box
        }
    } else {
        snake.pop()
    }
    
    let newHead = {
        x: snakeX,
        y: snakeY
    }

    if(snakeX < 0) {
        newHead.x = 400 - box;
    } else if(snakeX > 400) {
        newHead.x = 0;
    }

    if(snakeY < 0) {
        newHead.y = 400 - box;
    } else if(snakeY > 400) {
        newHead.y = 0;
    }
    
    if(collision(newHead, snake) || seconds === 0){
        clearInterval(game);
        gameOver = true;
        return;
    }
    
    snake.unshift(newHead)
    
    context.fillStyle = "red"
    context.font = "30px Arial"
    context.fillText(score, 2*box, 1.6*box)
    
    context.fillStyle = seconds < 11 ? "red" : "green"
    context.font = "20px Arial"
    context.fillText(`Temps: ${seconds > 9 ? "" : "0"}${seconds}s`, 14*box, 1.6*box)
}

function startTimer() {
    setInterval(() => {
        if (!gameOver && seconds > 0) {
            seconds--;
        }
    }, 1000);
}

let game = setInterval(draw, 75);
startTimer();