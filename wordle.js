const gameContainer = document.getElementById("cs-game-container")
const currentPlayerDisplay = document.getElementById("cs-current-player")
const countDownDisplay = document.getElementById("cs-count-down")

let inputForm = document.getElementById("cs-input-form")

//DEVELOPMENT PLAYERS (TO BE DELETED)
let players = [
    {
        name: "Connor",
        wordleScore: 0,
        penduScore: 0,
        snakeScore: 0,
        demineurScore: 0,
        twoThousandFortyEightScore: 0, 
    },
    {
        name: "Soukaina",
        wordleScore: 0,
        penduScore: 0,
        snakeScore: 0,
        demineurScore: 0,
        twoThousandFortyEightScore: 0, 
    },
    {
        name: "Thomas",
        wordleScore: 0,
        penduScore: 0,
        snakeScore: 0,
        demineurScore: 0,
        twoThousandFortyEightScore: 0, 
    },
]

localStorage.setItem("t2p-players", JSON.stringify(players))
//END OF DEVELOPMENT PLAYERS (TO BE DELETED)

//GET PLAYER INFO FROM LOCAL
const playersArrayJson = localStorage.getItem("t2p-players")
const playersArray = JSON.parse(playersArrayJson)

//GAME PLAY VARIABLES
let word
let clue
let guessCount = 1
let outOfGuesses = false
let playerScore = 0
let playerCount = 0

//DISPLAY PLAYER 1
currentPlayerDisplay.innerText = `Au tour de ${playersArray[playerCount].name}`

//CLICK BUTTON CAlls the API
const startBtnClick = async () => {
    //GLOBAL VARIABLES AT THE START OF EACH GAME
    // console.log("Player: ", playersArray[playerCount].name)
    // console.log("playerCount: ", playerCount)
    // console.log("playerScore ", playerScore)
    // console.log("guessCount ", guessCount)
    // console.log("outOfGuesses ", outOfGuesses)

    let clueP = document.getElementById("cs-clue-p")
    let messages = document.getElementById("cs-messages")
    try {
        let data = await fetch(`https://trouve-mot.fr/api/size/5`)
        let wordObj = await data.json()
        word = wordObj[0].name 
        console.log(word)
        clue = wordObj[0].categorie
        clueP.innerText = `Indice: ${clue}`
        outOfGuesses = false
        resetInputs()
        countDown()
    } catch (error) {
        messages.innerText = `Il y avait une erreur: ${error.message}. Tenter de recharger la page.`
    }
    let startBtn = document.getElementById("cs-start-button")
    startBtn.style.display = "none"
}

const formSubmit = (event) => {
    event.preventDefault()
    
    let firstLetter = document.getElementById("cs-1-letter")
    let secondLetter = document.getElementById("cs-2-letter")
    let thirdLetter = document.getElementById("cs-3-letter")
    let fourthLetter = document.getElementById("cs-4-letter")
    let fifthLetter = document.getElementById("cs-5-letter")
    let messages = document.getElementById("cs-messages")

    if (firstLetter.value.length !== 1 || secondLetter.value.length !== 1 || thirdLetter.value.length !== 1 || fourthLetter.value.length !== 1 || fifthLetter.value.length !== 1) {
        return
    }

    let guessLetters = [firstLetter.value, secondLetter.value, thirdLetter.value, fourthLetter.value, fifthLetter.value]
    let guessWord = guessLetters.join("").toLocaleLowerCase()
    let wordArray = word.split("")
    
    //ENHANCEMENT FOR THE FUTURE - CHECK THE INPUT AGAINST A FRENCH LANGUAGE DICTIONARY TO BE SURE IT IS A REAL WORD (NO FRENCH LANGUAGE DICTIONARY APIs FOUND AT THE TIME OF DEVELOPEMENT) 
    //Emailed Collins to ask for free access to their api to check if the entry is a word - awaiting their response before incorperating this into the game

    let boxColors = []
    let wordScore = []
    
    for (let i = 0; i < guessWord.length; i++) {
        if (wordArray.includes(guessLetters[i])) {
            if (wordArray[i] === guessLetters[i]) {
                boxColors.push("green")
                wordScore.push(200)
            } else {
                boxColors.push("orange")
                wordScore.push(100)
            }  
        } else {
            boxColors.push("black")
            wordScore.push(0)
        }
    }

    let playerScoreTemp = wordScore.reduce((a, b) => a + b)

    if (playerScoreTemp === 1000) {
        playerScore = playerScoreTemp
        messages.innerText = `Vous avez trouvé le bon mot!` 
        outOfGuesses = true
        endGame()
    } else if (playerScore > playerScoreTemp) {
        playerScore = playerScore
    } else {
        playerScore = playerScoreTemp
    }

    let parentElementPs = document.getElementById(`cs-guess-${guessCount}`)

    parentElementPs.innerHTML = `
        <p class="cs-display-box" style="background-color: ${boxColors[0]};">${firstLetter.value}</p>
        <p class="cs-display-box" style="background-color: ${boxColors[1]};">${secondLetter.value}</p>
        <p class="cs-display-box" style="background-color: ${boxColors[2]};">${thirdLetter.value}</p>
        <p class="cs-display-box" style="background-color: ${boxColors[3]};">${fourthLetter.value}</p>
        <p class="cs-display-box" style="background-color: ${boxColors[4]};">${fifthLetter.value}</p>
    `
    let parentElementInputsPosition = guessCount + 1
    let parentElementInputs = document.getElementById(`cs-guess-${parentElementInputsPosition}`)
    
    if (parentElementInputsPosition < 7 && playerScoreTemp !== 1000) {
        parentElementInputs.innerHTML = `
            <form id="cs-input-form" onsubmit="formSubmit(event)">
                <label class="cs-labels" for="cs-1-letter">Premier lettre</label>
                <input class="cs-display-box cs-inputs" id="cs-1-letter" type="text" maxlength="1" required>
                <label class="cs-labels" for="cs-2-letter">Deuxieme lettre</label>
                <input class="cs-display-box cs-inputs" id="cs-2-letter" type="text" maxlength="1" required>
                <label class="cs-labels" for="cs-3-letter">Troisieme lettre</label>
                <input class="cs-display-box cs-inputs" id="cs-3-letter" type="text" maxlength="1" required>
                <label class="cs-labels" for="cs-4-letter">Quatrieme lettre</label>
                <input class="cs-display-box cs-inputs" id="cs-4-letter" type="text" maxlength="1" required>
                <label class="cs-labels" for="cs-5-letter">Cinqieme lettre</label>
                <input class="cs-display-box cs-inputs" id="cs-5-letter" type="text" maxlength="1" required>
                <input type="submit" value="Soumettre">
            </form>
        `   
        resetInputs()
    }

    guessCount++

    if (guessCount === 7) {
        messages.innerText = `Vous n'avez plus de tentatives!` 
        outOfGuesses = true
        endGame()
    }
}

class TempPlayerScore {
    constructor(name, score, time, timeRemaining) {
        this.name = name,
        this.score = score,
        this.time = time,
        this.timeRemaining = timeRemaining
    }
}

let arrayOfPlayersScores = []

const endGame = () => {
    let messages = document.getElementById("cs-messages")

    let tempPlayerScore = new TempPlayerScore(playersArray[playerCount].name, playerScore, (60 - seconds), seconds)

    arrayOfPlayersScores.push(tempPlayerScore)

    messages.innerText += `\nLe mot était "${word}". \nVotre score est ${playerScore} \n(Ce score sert uniquement à classer les joueurs une fois que tout le monde a joué.)`
    
    if (playerCount === playersArray.length - 1) {
        //THIS BUTTON (MAYBE AN <a></a>) NEEDS TO BE THE LINK OUT OF WORDLE (EITHER TO FINAL SCORES OR DIRECT TO THE NEXT GAME)
        gameContainer.innerHTML += `
            <button onclick="tempFunction()")}" style="display: block">Passer au resultats finals de Wordle</button>
        `
        arrayOfPlayersScores.forEach((element) => {
            gameContainer.innerHTML += `
                \n<tr>
                    <th style="font-weight: bold">Player: ${element.name},</th>
                    <td>Score: ${element.score},</td>
                    <td>Time: ${element.time}s</td>
                </tr>
            `
        })
        endWordle()
    } else {
        // create a button to "Load next player"
        gameContainer.innerHTML += `
            <button onclick="loadNewPlayer()" style="display: block">Passer au prochain jouer</button>
        `
        arrayOfPlayersScores.forEach((element) => {
            gameContainer.innerHTML += `
                \n<tr>
                    <th style="font-weight: bold">Player: ${element.name},</th>
                    <td>Score: ${element.score},</td>
                    <td>Time: ${element.time}s</td>
                </tr>
            `
        })  
    }
}

//tempFunction for deleting
const tempFunction = () => {
    console.log("This is over baby!")
}

const endWordle = () => {
    console.log("arrayOfPlayersScores", arrayOfPlayersScores)
    
    //SORT BY SCORE AND THEN TIME
    arrayOfPlayersScores.sort((a, b) => {
        if (a.score !== b.score) {
            return a.score - b.score
        } else {
            return a.timeRemaining - b.timeRemaining
        }
    })
    
    //REVERSE ARRAY SO THAT HIGHEST PLAYER IS FIRST
    
    arrayOfPlayersScores.reverse()
    
    
    let points = arrayOfPlayersScores.length
    let samePoints = 1
    
    for (let i = 0; i < arrayOfPlayersScores.length; i++) {
        if (i === 0) {
            //ASSIGN THE FIRST PLAYER MAX POINTS
            let index = playersArray.findIndex((element) => {return element.name === arrayOfPlayersScores[i].name})
            playersArray[index].wordleScore = points
        } else if (arrayOfPlayersScores[i].score === arrayOfPlayersScores[i - 1].score && arrayOfPlayersScores[i].timeRemaining === arrayOfPlayersScores[i - 1].timeRemaining) {
            //IF THE CURRENT PLAYER HAS THE SAME SCORE AND TIME AS PREVIOUS PLAYER THEY GET THE SAME POINTS (KEEP TRACK OF HOW MANY TIMES THIS IS THE CASE WITH samePoints)
            let index = playersArray.findIndex((element) => {return element.name === arrayOfPlayersScores[i].name})
            playersArray[index].wordleScore = points
            samePoints++
        } else {
            //CURRENT PLAYER HAS DIFFERENT SCORE OR TIME COMPARED WITH THE PREVIOUS
            let index = playersArray.findIndex((element) => {return element.name === arrayOfPlayersScores[i].name})
            playersArray[index].wordleScore = points - samePoints
            //just add the score based on the array...
            points = points - samePoints
            samePoints = 1
        }
    }
    
    localStorage.clear()
    localStorage.setItem("t2p-players", JSON.stringify(playersArray))
}


    

//CODE FOR INPUT FOCUSING
const resetInputs = () => {
    let inputsArray = document.querySelectorAll(".cs-inputs")
    inputForm = document.getElementById("cs-input-form")
    inputsArray.forEach(element => element.disabled = false)
    inputsArray.forEach(element => {
        element.addEventListener("keydown", (event) => {
            let idString = event.target.id.slice(3, 4)
            let idNumber = Number(idString)
            
            if (idNumber !== 1 && event.key === "Backspace" && event.target.value.length === 0) {
                let newFocus = document.getElementById(`cs-${idNumber - 1}-letter`)
                newFocus.focus()
            } else if (idNumber !== 5 && event.target.value.length === 1) {
                let newFocus = document.getElementById(`cs-${idNumber + 1}-letter`)
                newFocus.focus()
            } 
        })
    })
}

let seconds
const countDown = () => {  
    let messages = document.getElementById("cs-messages")  
    seconds = 59
    function tick () {
        if (outOfGuesses) {
            clearInterval(ticker) 
            return
        }
        seconds--
        countDownDisplay.innerText = `Time: ${seconds > 9 ? "" : "0"}${seconds}s` 
        seconds < 11 ? countDownDisplay.style.color = "red" : ""
        if (seconds === 0) {
            clearInterval(ticker)
            messages.innerText = `Vous n'avez plus de temps!` 
            let inputs = document.querySelectorAll(".cs-inputs")
            inputs.forEach(element => element.disabled = true)
            endGame()
        }
    }
    let ticker = setInterval(tick, 1000)
}


const loadNewPlayer = () => {
    guessCount = 1
    playerCount++
    playerScore = 0
    outOfGuesses = false

    let startBtn = document.getElementById("cs-start-button")
    startBtn.style.display = "block"
    console.log("Load New Player!")
    currentPlayerDisplay.innerText = `Au tour de ${playersArray[playerCount].name}`
    countDownDisplay.innerText = "Time: 1:00"
    gameContainer.innerHTML = `
        <p id="cs-clue-p"></p>
        <p id="cs-messages"></p>
        <div class="cs-word-container" id="cs-guess-1">
            <form id="cs-input-form" onsubmit="formSubmit(event)">
                <label class="cs-labels" for="cs-1-letter">Premier lettre</label>
                <input class="cs-display-box cs-inputs" id="cs-1-letter" type="text" maxlength="1" required disabled="true">
                <label class="cs-labels" for="cs-2-letter">Deuxieme lettre</label>
                <input class="cs-display-box cs-inputs" id="cs-2-letter" type="text" maxlength="1" required disabled="true">
                <label class="cs-labels" for="cs-3-letter">Troisieme lettre</label>
                <input class="cs-display-box cs-inputs" id="cs-3-letter" type="text" maxlength="1" required disabled="true">
                <label class="cs-labels" for="cs-4-letter">Quatrieme lettre</label>
                <input class="cs-display-box cs-inputs" id="cs-4-letter" type="text" maxlength="1" required disabled="true">
                <label class="cs-labels" for="cs-5-letter">Cinqieme lettre</label>
                <input class="cs-display-box cs-inputs" id="cs-5-letter" type="text" maxlength="1" required disabled="true">
                <input type="submit" value="Soumettre">
            </form>
        </div>
        <div class="cs-word-container" id="cs-guess-2">
            <p class="cs-display-box-p"></p>
            <p class="cs-display-box-p"></p>
            <p class="cs-display-box-p"></p>
            <p class="cs-display-box-p"></p>
            <p class="cs-display-box-p"></p>
        </div>
        <div class="cs-word-container" id="cs-guess-3">
            <p class="cs-display-box-p"></p>
            <p class="cs-display-box-p"></p>
            <p class="cs-display-box-p"></p>
            <p class="cs-display-box-p"></p>
            <p class="cs-display-box-p"></p>
        </div>
        <div class="cs-word-container" id="cs-guess-4">
            <p class="cs-display-box-p"></p>
            <p class="cs-display-box-p"></p>
            <p class="cs-display-box-p"></p>
            <p class="cs-display-box-p"></p>
            <p class="cs-display-box-p"></p>
        </div>
        <div class="cs-word-container" id="cs-guess-5">
            <p class="cs-display-box-p"></p>
            <p class="cs-display-box-p"></p>
            <p class="cs-display-box-p"></p>
            <p class="cs-display-box-p"></p>
            <p class="cs-display-box-p"></p>
        </div>
        <div class="cs-word-container" id="cs-guess-6">
            <p class="cs-display-box-p"></p>
            <p class="cs-display-box-p"></p>
            <p class="cs-display-box-p"></p>
            <p class="cs-display-box-p"></p>
            <p class="cs-display-box-p"></p>
        </div>
        <button id="cs-start-button" onclick="startBtnClick()">Cliquer pour commencer le jeu</button>
    `
}
