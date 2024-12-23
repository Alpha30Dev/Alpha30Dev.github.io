let playersTest = [
    {
        name: "Connor",
        wordleScore: 0,
        hangmanScore: 0,
        snakeScore: 0,
        minesweeperScore: 0,
        game2048: 0, 
    },
    {
        name: "Soukaina",
        wordleScore: 0,
        hangmanScore: 0,
        snakeScore: 0,
        minesweeperScore: 0,
        game2048: 0,  
    },
    {
        name: "Thomas",
        wordleScore: 0,
        hangmanScore: 0,
        snakeScore: 0,
        minesweeperScore: 0,
        game2048: 0, 
    },
]

localStorage.setItem("t2p-players", JSON.stringify(playersTest))

let ticker;
let inGame = false;
let selectedWord = "";
let guessedLetters = [];
let attemptsLeft = 6;
let gameEnd = false;
let score = 0;

let players = JSON.parse(localStorage.getItem("t2p-players"));
let currentPlayer = 0;

const countDownDisplay = document.getElementById("count-down");

async function loadWords() {
    try { 
        const response = await fetch("/json/mots.json");
        const data = await response.json();
        const words = data.mots;
        document.getElementById("player-name").innerText = players[currentPlayer].name;
        selectRandomWord(words);
        
    } catch (error) {
        console.error("Erreur lors du chargement des mots :", error);
        selectedWord = "pendu";
        guessedLetters = [];
        attemptsLeft = 6;
        
        updateDisplay();
    }
}

document.querySelector("body").addEventListener("click", () => startGame());

async function startGame() {
    try{
        if (currentPlayer >= players.length) {
            window.location.replace("2048.html");
        }
        if (inGame) return;
        await loadWords();
        document.getElementById("player-name").innerText = players[currentPlayer].name;

        guessedLetters = [];
        attemptsLeft = 6;
        gameEnd = false;
        score = 0;
        inGame = true;
        countDown();
        updateDisplay();
    } catch (error) {
        console.error("Erreur lors du début du jeu :", error);
    }
}

function selectRandomWord(words) {
    const randomIndex = Math.floor(Math.random() * words.length);
    selectedWord = words[randomIndex];
    guessedLetters = [];
    attemptsLeft = 6;
    updateDisplay();
}

function calculatePoints() {
    const totalLetters = selectedWord.length; 
    const lettersFound = guessedLetters.filter(letter => selectedWord.includes(letter)).length; 
    const pointsPerLetter = 100 / totalLetters; 
    const totalPoints = totalLetters * pointsPerLetter; 

    return Math.round((lettersFound / totalLetters) * totalPoints); 
}

function updateDisplay() {
    const wordDisplay = document.getElementById("wordDisplay");
    const attemptsCount = document.getElementById("attemptsCount");
    const guesses = document.getElementById("guesses");
    const message = document.getElementById("message");
    const hangmanImage = document.getElementById("hangmanImage");
    const scoreDisplay = document.getElementById("scoreDisplay"); 

    wordDisplay.innerHTML = selectedWord.split('').map(letter => (guessedLetters.includes(letter) ? letter : "_")).join(' ');

    attemptsCount.innerText = attemptsLeft; 
    guesses.innerText = `Lettres devinées: ${guessedLetters.join(', ')}`; 
    hangmanImage.src = `elements/hangman${6 - attemptsLeft}.png`; 

    checkWin();

    const pointsEarned = calculatePoints(); 
    score = pointsEarned; 
    scoreDisplay.innerText = `Score: ${score}`; 
}

function checkWin() {
    if (attemptsLeft === 0) {
        message.innerText = `Vous avez perdu! Le mot était "${selectedWord}".`;
        gameEnd = true;
    } else if (!wordDisplay.innerText.includes("_")) {
        message.innerText = "Félicitations! Vous avez gagné!";
        gameEnd = true;
    } else {
        message.innerText = "";
    }

    if (gameEnd && inGame) {
        clearInterval(ticker);
        inGame = false;
        players[currentPlayer].hangmanScore += score;

        currentPlayer++;
        if (currentPlayer >= players.length) {
            let orderedPlayers = [...players];
            orderedPlayers.sort((a, b) => b.hangmanScore - a.hangmanScore);
            players.forEach(player => {
                let index = orderedPlayers.findIndex(p => p.name === player.name);
                player.hangmanScore = index + 1;
            });
            localStorage.setItem("t2p-players", JSON.stringify(players));
        }
    }   
}   

const countDown = () => {
    let seconds = 59;
    countDownDisplay.innerText = `Temps: ${seconds > 9 ? "" : "0"}${seconds}s`;

    function tick() {
        seconds--;
        countDownDisplay.innerText = `Temps: ${seconds > 9 ? "" : "0"}${seconds}s`;
        countDownDisplay.style.color = seconds < 11 ? "red" : "";
        console.log(seconds);
        if (seconds === 0) {
            clearInterval(ticker);
            gameEnd = true;
            updateDisplay(); // Met à jour l'affichage pour montrer que le jeu est perdu
            const message = document.getElementById("message");
            message.innerText = `Temps écoulé! Le mot était "${selectedWord}".`; // Affiche le message de time out
        }
    }

    ticker = setInterval(tick, 1000);
    console.log(ticker);
}

document.getElementById("guessButton").addEventListener("click", () => guessLetter());
document.getElementById("letterInput").addEventListener("keydown", (e) => guessLetter(e));

function guessLetter(e) {
    if (e) {
        if(e.key !== "Enter") return;
    }
    if (!inGame) return;
    const letterInput = document.getElementById("letterInput");
    const letter = letterInput.value.toLowerCase();

    if (letter && !guessedLetters.includes(letter) && !gameEnd) {
        guessedLetters.push(letter); 
        if (!selectedWord.includes(letter)) {
            attemptsLeft--; 
        }
        updateDisplay(); 
    }

    letterInput.value = ""; 
}

loadWords(); // Charge les mots au démarrage



