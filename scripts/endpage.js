class PlayerTotal {
    constructor(name, total, wordleScore, hangmanScore, minesweeperScore, snakeScore, game2048) {
        this.name = name,
        this.total = total,
        this.wordleScore = wordleScore, 
        this.hangmanScore = hangmanScore
        this.minesweeperScore = minesweeperScore,
        this.snakeScore = snakeScore 
        this.game2048 = game2048
    }
}

const playersArrayJson = localStorage.getItem("t2p-players")
const playersArray = JSON.parse(playersArrayJson)
const winner = document.getElementById("fp-header")
const scoreBox = document.getElementById("fp-score-box")
const detailsBtn = document.getElementById("fp-details-btn")
const replayBtn = document.getElementById("fp-replay-btn")

//CREATE TOTALS AND ORDER PLAYERS BY TOTALS
let playersWithTotalArray = []

playersArray.forEach(element => {
    let total = element.wordleScore + element.hangmanScore + element.minesweeperScore + element.snakeScore + element.game2048
    let playerWithTotal = new PlayerTotal(element.name, total, element.wordleScore, element.hangmanScore, element.minesweeperScore, element.snakeScore, element.game2048)
    playersWithTotalArray.push(playerWithTotal)
})

playersWithTotalArray.sort((a, b) => {return a.total - b.total})
playersWithTotalArray.reverse()

//DISPLAY WINNER
winner.innerText = `${playersWithTotalArray[0].name} A GAGNÉ !`

//DISPLAY SUMMARY
const displaySummary = () => {
    scoreBox.innerHTML = ""
    scoreBox.innerHTML = `
    <table id="fp-score-table">
        <thead>
            <tr>
                <th id="fp-first-column" scope="col">No</th>
                <th class="fp-second-column" scope="col">Joueur</th>
                <th class="fp-second-column" scope="col">Total</th>
                
            </tr>
        </thead>
    </table>
    `
    let scoreTable = document.getElementById("fp-score-table")
    let rank = 1
    playersWithTotalArray.forEach(element => {
        scoreTable.innerHTML += `
            <tr>
                <td id="fp-first-column">${rank}</td>
                <td class="fp-second-column">${element.name}</td>
                <td class="fp-second-column">${element.total}</td>
            </tr>
        `
        rank++
    })   
}

//REPLAY
replayBtn.addEventListener("click", () => {
    localStorage.clear()
    window.location.replace('./index.html')
})

//DETAILED SCOREBOARD TOGGLE
detailsBtn.addEventListener("click", () => {
    let scoreTable = document.getElementById("fp-score-table")
    if (scoreTable === null) {
        let detailsTable = document.getElementById("fp-details-table")
        detailsTable.remove()
        detailsBtn.innerText = "Voir les details"
        displaySummary()
    }
    else {
        detailsBtn.innerText = "Voir le resumé"
        scoreBox.innerHTML = ""
        scoreBox.innerHTML = `
            <table id="fp-details-table">
                <thead>
                    <tr>
                        <th id="fp-first-column" scope="col">No</th>
                        <th class="fp-second-column" scope="col">Joueur</th>
                        <th class="fp-second-column" scope="col">Wordle</th>
                        <th class="fp-second-column" scope="col">Snake</th>
                        <th class="fp-second-column" scope="col">Dimineur</th>
                        <th class="fp-second-column" scope="col">2048</th>
                        <th class="fp-second-column" scope="col">Pendu</th>
                        <th class="fp-second-column" scope="col">Total</th>
                    </tr>
                </thead>
            </table>
        `
        
        let detailsTable = document.getElementById("fp-details-table")
        let detailRank = 1
        
        playersWithTotalArray.forEach(element => {
            detailsTable.innerHTML += `
                <tr>
                    <td id="fp-first-column">${detailRank}</td>
                    <td class="fp-second-column">${element.name}</td>
                    <td class="fp-second-column">${element.wordleScore}</td>
                    <td class="fp-second-column">${element.snakeScore}</td>
                    <td class="fp-second-column">${element.minesweeperScore}</td>
                    <td class="fp-second-column">${element.game2048}</td>
                    <td class="fp-second-column">${element.hangmanScore}</td>
                    <td class="fp-second-column">${element.total}</td>
                </tr>
            `
            detailRank++
        }) 
    }
})

displaySummary()