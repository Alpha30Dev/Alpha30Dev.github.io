// Variables pour gérer l'état du jeu
let ticker; // Pour le compte à rebours
let inGame = false; // Indique si le jeu est en cours
let selectedWord = ""; // Mot sélectionné pour le jeu
let guessedLetters = []; // Lettres devinées par le joueur
let attemptsLeft = 6; // Tentatives restantes
let gameEnd = false; // Indique si le jeu est terminé
let score = 0; // Score du joueur

// Récupération des joueurs depuis le stockage local
let players = JSON.parse(localStorage.getItem("t2p-players"));
let currentPlayer = 0; // Indice du joueur actuel

// Élément pour afficher le compte à rebours
const countDownDisplay = document.getElementById("count-down");

// Fonction pour charger les mots depuis un fichier JSON
async function loadWords() {
    try { 
        const response = await fetch("/json/mots.json"); // Récupération des mots
        const data = await response.json(); // Conversion en JSON
        const words = data.mots; // Extraction des mots
        document.getElementById("player-name").innerText = players[currentPlayer].name; // Affichage du nom du joueur
        selectRandomWord(words); // Sélection d'un mot aléatoire
        
    } catch (error) {
        console.error("Erreur lors du chargement des mots :", error); // Gestion des erreurs
        selectedWord = "pendu"; // Mot par défaut en cas d'erreur
        guessedLetters = []; // Réinitialisation des lettres devinées
        attemptsLeft = 6; // Réinitialisation des tentatives
        
        updateDisplay(); // Mise à jour de l'affichage
    }
}

// Événement pour démarrer le jeu lors d'un clic sur le corps du document
document.querySelector("body").addEventListener("click", () => startGame());

async function startGame() {
    try {
        // Vérification si tous les joueurs ont joué
        if (currentPlayer >= players.length) {
            window.location.replace("2048.html"); // Redirection vers une autre page
        }
        if (inGame) return; // Si le jeu est déjà en cours, ne rien faire
        await loadWords(); // Chargement des mots
        document.getElementById("player-name").innerText = players[currentPlayer].name; // Affichage du nom du joueur

        // Réinitialisation des variables de jeu
        guessedLetters = [];
        attemptsLeft = 6;
        gameEnd = false;
        score = 0;
        inGame = true; // Le jeu commence
        countDown(); // Démarrage du compte à rebours
        updateDisplay(); // Mise à jour de l'affichage
    } catch (error) {
        console.error("Erreur lors du début du jeu :", error); // Gestion des erreurs
    }
}

// Fonction pour sélectionner un mot aléatoire
function selectRandomWord(words) {
    const randomIndex = Math.floor(Math.random() * words.length); // Index aléatoire
    selectedWord = words[randomIndex]; // Mot sélectionné
    guessedLetters = []; // Réinitialisation des lettres devinées
    attemptsLeft = 6; // Réinitialisation des tentatives
    updateDisplay(); // Mise à jour de l'affichage
}

// Fonction pour calculer les points
function calculatePoints() {
    const totalLetters = selectedWord.length; // Nombre total de lettres
    const lettersFound = guessedLetters.filter(letter => selectedWord.includes(letter)).length; // Lettres trouvées
    const pointsPerLetter = 100 / totalLetters; // Points par lettre
    const totalPoints = totalLetters * pointsPerLetter; // Points totaux

    return Math.round((lettersFound / totalLetters) * totalPoints); // Retourne les points arrondis
}

// Fonction pour mettre à jour l'affichage du jeu
function updateDisplay() {
    const wordDisplay = document.getElementById("wordDisplay"); // Élément pour afficher le mot
    const attemptsCount = document.getElementById("attemptsCount"); // Élément pour afficher les tentatives restantes
    const guesses = document.getElementById("guesses"); // Élément pour afficher les lettres devinées
    const message = document.getElementById("message"); // Élément pour afficher les messages
    const hangmanImage = document.getElementById("hangmanImage"); // Élément pour afficher l'image du pendu
    const scoreDisplay = document.getElementById("scoreDisplay"); // Élément pour afficher le score

    // Affichage du mot avec des underscores pour les lettres non devinées
    wordDisplay.innerHTML = selectedWord.split('').map(letter => (guessedLetters.includes(letter) ? letter : "_")).join(' ');

    attemptsCount.innerText = attemptsLeft; // Affichage des tentatives restantes
    guesses.innerText = `Lettres devinées: ${guessedLetters.join(', ')}`; // Affichage des lettres devinées
    hangmanImage.src = `elements/hangman${6 - attemptsLeft}.png`; // Changement de l'image du pendu

    checkWin(); // Vérification de la victoire

    const pointsEarned = calculatePoints(); // Calcul des points gagnés
    score = pointsEarned; // Mise à jour du score
    scoreDisplay.innerText = `Score: ${score}`; // Affichage du score
}

// Fonction pour vérifier si le joueur a gagné ou perdu
function checkWin() {
    if (attemptsLeft === 0) {
        message.innerText = `Vous avez perdu! Le mot était "${selectedWord}".`; // Message de perte
        gameEnd = true; // Fin du jeu
    } else if (!wordDisplay.innerText.includes("_")) {
        message.innerText = "Félicitations! Vous avez gagné!"; // Message de victoire
        gameEnd = true; // Fin du jeu
    } else {
        message.innerText = ""; // Pas de message
    }

    // Si le jeu est terminé
    if (gameEnd && inGame) {
        clearInterval(ticker); // Arrêt du compte à rebours
        inGame = false; // Le jeu n'est plus en cours
        players[currentPlayer].hangmanScore += score; // Mise à jour du score du joueur

        currentPlayer++; // Passage au joueur suivant
        // Vérification si tous les joueurs ont joué
        if (currentPlayer >= players.length) {
            let orderedPlayers = [...players]; // Copie du tableau des joueurs
            orderedPlayers.sort((a, b) => b.hangmanScore - a.hangmanScore); // Tri des joueurs par score
            players.forEach(player => {
                let index = orderedPlayers.findIndex(p => p.name === player.name); // Trouver l'index du joueur
                player.hangmanScore = index + 1; // Attribuer le rang basé sur l'index
            });
            localStorage.setItem("t2p-players", JSON.stringify(players)); // Enregistrement des joueurs mis à jour
        }
    }   
}   

// Fonction pour gérer le compte à rebours
const countDown = () => {
    let seconds = 59; // Durée du compte à rebours
    countDownDisplay.innerText = `Temps: ${seconds > 9 ? "" : "0"}${seconds}s`; // Affichage du temps

    function tick() {
        seconds--; // Décrémenter le temps
        countDownDisplay.innerText = `Temps: ${seconds > 9 ? "" : "0"}${seconds}s`; // Mise à jour de l'affichage
        countDownDisplay.style.color = seconds < 11 ? "red" : ""; // Changer la couleur si le temps est faible
        console.log(seconds); // Affichage du temps restant dans la console
        if (seconds === 0) {
            clearInterval(ticker); // Arrêt du compte à rebours
            gameEnd = true; // Fin du jeu
            updateDisplay(); // Mise à jour de l'affichage pour montrer que le jeu est perdu
            const message = document.getElementById("message");
            message.innerText = `Temps écoulé! Le mot était "${selectedWord}".`; // Affiche le message de time out
        }
    }

    ticker = setInterval(tick, 1000); // Démarrage du compte à rebours
    console.log(ticker); // Affichage de l'intervalle dans la console
}

// Événements pour deviner une lettre
document.getElementById("guessButton").addEventListener("click", () => guessLetter());
document.getElementById("letterInput").addEventListener("keydown", (e) => guessLetter(e));

// Fonction pour deviner une lettre
function guessLetter(e) {
    if (e) {
        if(e.key !== "Enter") return; // Ne pas continuer si ce n'est pas la touche "Entrée"
    }
    if (!inGame) return; // Ne pas continuer si le jeu n'est pas en cours
    const letterInput = document.getElementById("letterInput"); // Élément d'entrée pour la lettre
    const letter = letterInput.value.toLowerCase(); // Récupération de la lettre en minuscules

    // Vérification si la lettre est valide
    if (letter && !guessedLetters.includes(letter) && !gameEnd) {
        guessedLetters.push(letter); // Ajout de la lettre devinée
        if (!selectedWord.includes(letter)) {
            attemptsLeft--; // Décrémenter les tentatives si la lettre n'est pas dans le mot
        }
        updateDisplay(); // Mise à jour de l'affichage
    }

    letterInput.value = ""; // Réinitialisation de l'entrée de lettre
}

// Chargement des mots au démarrage
loadWords(); 


