let selectedWord = "";
let guessedLetters = [];
let attemptsLeft = 6;
let gameLost = false;
let score = 0; 
const countDownDisplay = document.getElementById("count-down");

async function loadWords() {
    try { 
        const response = await fetch("/json/mots.json");
        const data = await response.json();
        const words = data.mots;
        selectRandomWord(words);
        countDown();
    } catch (error) {
        console.error("Erreur lors du chargement des mots :", error);
        selectedWord = "pendu";
        guessedLetters = [];
        attemptsLeft = 6;
        updateDisplay();
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

    if (attemptsLeft === 0) {
        message.innerText = `Vous avez perdu! Le mot était "${selectedWord}".`;
        gameLost = true;
    } else if (!wordDisplay.innerText.includes("_")) {
        message.innerText = "Félicitations! Vous avez gagné!";
    } else {
        message.innerText = "";
    }

    const pointsEarned = calculatePoints(); 
    score = pointsEarned; 
    scoreDisplay.innerText = `Score: ${score}`; 
}

const countDown = () => {
    let seconds = 59;
    countDownDisplay.innerText = `Temps: ${seconds > 9 ? "" : "0"}${seconds}s`;

    function tick() {
        seconds--;
        countDownDisplay.innerText = `Temps: ${seconds > 9 ? "" : "0"}${seconds}s`;
        countDownDisplay.style.color = seconds < 11 ? "red" : "";

        if (seconds === 0) {
            clearInterval(ticker);
            gameLost = true;
            updateDisplay(); // Met à jour l'affichage pour montrer que le jeu est perdu
            const message = document.getElementById("message");
            message.innerText = `Temps écoulé! Le mot était "${selectedWord}".`; // Affiche le message de time out
        }
    }

    let ticker = setInterval(tick, 1000);
}

document.getElementById("guessButton").addEventListener("click", () => {
    const letterInput = document.getElementById("letterInput");
    const letter = letterInput.value.toLowerCase();

    if (letter && !guessedLetters.includes(letter) && !gameLost) {
        guessedLetters.push(letter); 
        if (!selectedWord.includes(letter)) {
            attemptsLeft--; 
        }
        updateDisplay(); 
    }

    letterInput.value = ""; 
});

loadWords(); // Charge les mots au démarrage