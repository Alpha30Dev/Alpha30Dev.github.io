const canvas = document.querySelector("canvas");
const display = document.querySelector(".display");
const context = canvas.getContext('2d');

canvas.width = display.offsetWidth - display.offsetWidth % 20;
canvas.height = display.offsetHeight - display.offsetHeight % 20;

let box = 20;

let snake = [];
snake[0] = { x: Math.floor(canvas.width/2/box)*box, y: Math.floor(canvas.height/2/box)*box }

let food = {
    x: Math.floor(Math.random() * (canvas.width/box)) * box,
    y: Math.floor(Math.random() * (canvas.height/box)) * box
}
// //test
// let players = [
//     {
//         name: "Connor",
//         wordleScore: 0,
//         hangmanScore: 0,
//         snakeScore: 0,
//         minesweeperScore: 0,
//         game2048: 0, 
//     },
//     {
//         name: "Soukaina",
//         wordleScore: 0,
//         hangmanScore: 0,
//         snakeScore: 0,
//         minesweeperScore: 0,
//         game2048: 0, 
//     },
//     {
//         name: "Thomas",
//         wordleScore: 0,
//         hangmanScore: 0,
//         snakeScore: 0,
//         minesweeperScore: 0,
//         game2048: 0, 
//     },
// ]

// localStorage.setItem("t2p-players", JSON.stringify(players))
//test
let score = 0
let d
let seconds = 59
let gameOver = false
let lastDirection = null
let lastFoodTime = Date.now();

const scoreDisplay = document.querySelector('.top-screen span:nth-child(3)');
const timeDisplay = document.querySelector('.top-screen span:nth-child(2)');

document.addEventListener("keydown", direction);

let timerStarted = false;

const players = JSON.parse(localStorage.getItem("t2p-players"));

function direction(event){
    event.preventDefault();
    let key = event.keyCode;
    
    if (!timerStarted) {
        startTimer();
        timerStarted = true;
    }
    
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

let currentPlayerIndex = 0;
const playerNameDisplay = document.querySelector('.top-screen span:nth-child(1)');

function updatePlayerDisplay() {
    playerNameDisplay.textContent = players[currentPlayerIndex].name;
}

function saveScoreAndNextPlayer() {
    // Sauvegarder le score temporaire
    players[currentPlayerIndex].tempSnakeScore = score;
    
    // Si c'est le dernier joueur, calculer les points finaux pour tous
    if (currentPlayerIndex === players.length - 1) {
        // Créer un tableau temporaire avec les scores et les indices
        let tempScores = players.map((player, index) => ({
            index: index,
            score: player.tempSnakeScore || 0
        }));
        
        // Trier les scores du plus haut au plus bas
        tempScores.sort((a, b) => b.score - a.score);
        
        // Attribuer les points en fonction du classement
        tempScores.forEach((item, position) => {
            // Le nombre de points est égal au nombre de joueurs - position
            let points = players.length - position;
            
            // Si des joueurs ont le même score, ils reçoivent le même nombre de points
            if (position > 0 && tempScores[position - 1].score === item.score) {
                points = players.length - (position - 1);
            }
            
            // Mettre à jour le score Snake dans le format attendu par endPage
            players[item.index].snakeScore = points;
        });
        
        // Sauvegarder dans localStorage et rediriger
        localStorage.setItem("t2p-players", JSON.stringify(players));
        window.location.href = '/wordle.html';
    } else {
        // Passage au joueur suivant
        currentPlayerIndex++;
        resetGame();
        localStorage.setItem("t2p-players", JSON.stringify(players));
    }
}

let timerInterval;

function startTimer() {
    // Arrêt du timer précédent s'il existe
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    timerInterval = setInterval(() => {
        if (!gameOver && seconds > 0) {
            seconds--;
            timeDisplay.textContent = `Time : ${seconds > 9 ? "" : "0"}${seconds}s`;
        }
    }, 1000);
}

function resetGame() {
    snake = [];
    snake[0] = { x: Math.floor(canvas.width/2/box)*box, y: Math.floor(canvas.height/2/box)*box };
    food = {
        x: Math.floor(Math.random() * (canvas.width/box)) * box,
        y: Math.floor(Math.random() * (canvas.height/box)) * box
    };
    score = 0;
    seconds = 59;
    gameOver = false;
    timerStarted = false;
    d = lastDirection = null;
    updatePlayerDisplay();
    game = setInterval(draw, 50);
    if (timerInterval) {
        clearInterval(timerInterval);
    }
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
        
        score += (timeDifference < 2) ? 300 : 150;
        
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
        saveScoreAndNextPlayer();
        return;
    }
    
    snake.unshift(newHead)
    
    scoreDisplay.textContent = `Score : ${score}`;
    timeDisplay.textContent = `Time : ${seconds > 9 ? "" : "0"}${seconds}s`;
}

let game = setInterval(draw, 50);

// Initialisation au chargement
updatePlayerDisplay();