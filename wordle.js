const currentPlayerDisplay = document.getElementById("current-player")
const countDownDisplay = document.getElementById("count-down")
const startBtn = document.getElementById("cs-start-button")
const messages = document.getElementById("cs-messages")
const clueP = document.getElementById("cs-clue-p")
let inputForm = document.getElementById("cs-input-form")



let players = [
    {
        player: "Connor",
        turn: "false",
        wordleScore: 0,
        penduScore: 0,
        snakeScore: 0,
        demineurScore: 0,
        twoThousandFortyEightScore: 0, 
    },
    {
        player: "Soukaina",
        turn: "false",
        wordleScore: 0,
        penduScore: 0,
        snakeScore: 0,
        demineurScore: 0,
        twoThousandFortyEightScore: 0, 
    },
]

localStorage.setItem("players", JSON.stringify(players))



//GET PLAYER INFO FROM LOCAL
const playersArrayJson = localStorage.getItem("players")
const playersArray = JSON.parse(playersArrayJson)

let playerCount = playersArray.length
playerCount--

//DISPLAY PLAYER 1
currentPlayerDisplay.innerText = `Au tour de ${playersArray[0].player}`

//GAME PLAY VARIABLES
let word
let clue
let guessCount = 1
let gameStarted = false


//CLICK BUTTON CAlls the API

startBtn.addEventListener("click", async () => {
    try {
        let data = await fetch(`https://trouve-mot.fr/api/size/5`)
        let wordObj = await data.json()
        word = wordObj[0].name 
        console.log(word)
        clue = wordObj[0].categorie
        clueP.innerText = `Indice: ${clue} (ne deviner que des vrais mots de 5 lettres)`
        gameStarted = true
        resetInputs()
        //countDown()
    } catch (error) {
        messages.innerText = `Il y avait une erreur: ${error.message}. Tenter de recharger la page.`
    }
})

const formSubmit = async (event) => {
    event.preventDefault()
   
    let firstLetter = document.getElementById("cs-1-letter")
    let secondLetter = document.getElementById("cs-2-letter")
    let thirdLetter = document.getElementById("cs-3-letter")
    let fourthLetter = document.getElementById("cs-4-letter")
    let fifthLetter = document.getElementById("cs-5-letter")

    if (firstLetter.value.length !== 1 || secondLetter.value.length !== 1 || thirdLetter.value.length !== 1 || fourthLetter.value.length !== 1 || fifthLetter.value.length !== 1) {
        return
    }

    let guessLetters = [firstLetter.value, secondLetter.value, thirdLetter.value, fourthLetter.value, fifthLetter.value]
    let guessWord = guessLetters.join("").toLocaleLowerCase()
    let wordArray = word.split("")
    
    //ENHANCEMENT FOR THE FUTURE - CHECK THE INPUT AGAINST A FRENCH LANGUAGE DICTIONARY TO BE SURE IT IS A REAL WORD (NO FRENCH LANGUAGE DICTIONARY APIs FOUND AT THE TIME OF DEVELOPEMENT) 
    //Emailed Collins to ask for free access to their api to check if the entry is a word - awaiting their response before incorperating this into the game
    try { 
        const response = await fetch(`https://fr.wiktionary.org/wiki/${guessWord}`);
        console.log(response.status)
	    const result = await response.json();
	    console.log(result);
    } catch (error) {
        console.error(response.status, error);
    } finally {
        console.log(response.status)
    }

    //forEach letter in the guessWord array is it in the wordArray?
    let boxColors = []
    let wordScore = []
    //COLOR CODE RESULT OF GUESS
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
        }
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
    console.log(parentElementInputsPosition)

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
    
    console.log(boxColors)
    guessCount++
    if (guessCount === 6) {
        //message "Out of guesses, the word was "${word}" "
        console.log("the game is ended")
        //endGame function
    }

}


const endGame = () => {


    //
    //"message - Your highest scoring guess was -> "



    // when guess count = 6 end game put in time display "Out of guesses"
    // timer === 0 stop game regardless of guesses and // calculate score and stock in a class (display score)
    // if playerCount = playersArray.length 
    //calculate player rank
    //update scores in localStorage and change turn for all players to false
    //playersArray.forEach(element => element.turn = false)
    //button becomes link to next game



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
    seconds = 59
    function tick () {
        seconds--
        countDownDisplay.innerText = `Time: ${seconds > 9 ? "" : "0"}${seconds}s` 
        seconds < 11 ? countDownDisplay.style.color = "red" : ""
        if (seconds === 0) {
            clearInterval(ticker)
            //message "Out of time, the word was "${word}" "
            //get inputs and make inputs.disabled = true
            //endGame()
        }
    }
    let ticker = setInterval(tick, 1000)
}


