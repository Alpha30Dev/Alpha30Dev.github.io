class MinesweeperClass {
    constructor(sizeX, sizeY, mines) {
        this.tiles = [];
        this.container = document.getElementById("tilesContainer");
        this.flagCounterHtml = document.getElementById("flagCount");
        this.fieldSize = sizeX * sizeY;
        this.gameRunning = false;
        this.gameStarted = false;
        this.totalMines = mines;

        for(let i = 0; i < this.fieldSize; i++) {
            this.container.children[i].textContent = "";
            this.container.children[i].className = "tile";

            const newTile = new TileClass(i, sizeX, sizeY);
            this.tiles.push(newTile);
            const newTileHtml = this.container.children[i];

            newTileHtml.addEventListener("click", () => {
                if (this.gameStarted == false) {
                    this.gameStarted = true;
                    this.startGame(newTile.position);
                    this.flagCounterHtml.textContent = mines;
                    game.startTimer();
                }
            });
        }
    }
    startGame(firstClickPos) {
        this.generateMines();
        this.generateNumbers();
        let tile;

        while(this.gameRunning == false) {
            tile = this.tiles[firstClickPos];

            //On fait tourner le tableau des mines jusqu'a une case vide.
            if (tile.isMine == true || tile.value != 0) {
                this.tiles.push(this.tiles.shift());
                this.tiles.forEach((e, i) =>  e.position = i);
                this.generateNumbers();
            } else this.gameRunning = true;
        }

        this.tiles.forEach((e, i) => {
            e.setHtmlTile(this.container.children[i]);
            e.htmlTile.addEventListener("click", () => this.tileClick(e));
            e.htmlTile.addEventListener("contextmenu", (event) => this.tileRightClick(event, e));
        });
        this.generateNumbers();
        this.tileClick(tile);
    }
    tileClick(tile) {
        if (tile.isClicked || tile.isFlagged || this.gameRunning == false) return;
        this.propagate(tile.position);
        tile.openTile();
        this.checkWin();
    }
    tileRightClick(event, element) {
        if (element.isClicked  || this.gameRunning == false) return;
        event.preventDefault();
        if (element.isFlagged) this.flagCounterHtml.textContent++;
        else this.flagCounterHtml.textContent--; 
        element.flagTile();
    }
    checkWin() {
        let openedTiles = 0;
        this.tiles.every(e => {
            if (e.isMine && e.isClicked) {
                this.loseGame();
                return false;
            }
            else if (e.isClicked) openedTiles++;
            return true;
        });
        if (openedTiles == this.fieldSize - this.totalMines) this.winGame();
    }
    generateMines() {
        let rnd;
        let tile;
        let generatedMines = 0;
        for(let i = 0; i < this.fieldSize; i++) {
            tile = this.tiles[i];
            rnd = (Math.round(Math.random() * this.fieldSize));

            if (tile.isMine == false && rnd < this.totalMines) {
                generatedMines++;
                tile.setAsMine();
                if (generatedMines == this.totalMines) return;
            }
            if (generatedMines < this.totalMines && i+1 == this.fieldSize) i=0;
        }
    }
    generateNumbers() {
        let tile;
        this.tiles.forEach(e => e.value = 0);
        for(let i = 0; i < this.fieldSize; i++) {
            tile = this.tiles[i];
            
            if (tile.isMine) {
                const mineNeighbours = tile.getNeighbours();
                tile.value = 9;
                mineNeighbours.forEach(e => { if (this.tiles[e].isMine == false) this.tiles[e].value++;});
            }
        }
    }
    propagate(from) {
        if (this.tiles[from].value != 0 || this.tiles[from].isMine == true || this.tiles[from].isFlagged == true) return;
        
        let tileList = [from];
        let element = tileList[0];
        let neighbours;

        for (let i = 0; i < tileList.length; i++) {
            element = tileList[i];

            neighbours = this.tiles[element].getNeighbours();
            neighbours = neighbours.filter((e) => {
                const notExist =  !tileList.includes(e);
                const isEmpty = this.tiles[e].value == 0 && this.tiles[e].isFlagged == false && this.tiles[e].isMine == false;
                return isEmpty && notExist;
            });
            
            neighbours.forEach(e => tileList.push(this.tiles[e].position));
        }

        tileList.forEach(element => {
            this.tiles[element].getNeighbours().forEach(e => {
                if (this.tiles[e].isFlagged == false && this.tiles[e].isMine == false) this.tiles[e].openTile();
            });
        });
    }
    winGame() {
        this.gameRunning = false;
        game.stopTimer();
        game.calculateScore();
        game.displayMessage(" a gagné.")
    }
    loseGame() {
        this.gameRunning = false;
        this.tiles.forEach(e => {
            if (e.isMine) {
                if (e.isClicked) e.htmlTile.style.color = "var(--tap2play-red)";
                e.openTile();
            }
        });
        game.stopTimer();
        game.calculateScore();
        game.displayMessage(" a perdu.")
    }
}

class TileClass {
    constructor(position, fieldSizeX, fieldSizeY) {
        this.position = position;
        this.fieldSizeX = fieldSizeX;
        this.fieldSizeY = fieldSizeY;
        this.isClicked = false;
        this.isMine = false;
        this.isFlagged = false;
        this.htmlTile;
        this.value = 0;
    }
    openTile() {
        if (this.isClicked) return;
        if (this.isMine) this.htmlTile.innerHTML = `<img class="mine" src="/icons/bomb.svg" alt="La case est une mine.">`;
        else if (this.value != 0) {
            const colorTable = ["0,0,255", "0,128,0", "255,0,0", "0,0,128", "128,128,0", "128,0,0", "0,0,0"];
            this.htmlTile.style.color = `rgb(${colorTable[this.value - 1]})`;
            this.htmlTile.innerHTML = this.value;
        }
        this.isClicked = true;
        this.htmlTile.className += " clicked";
    }
    flagTile() {
        if (this.isClicked) return;
        this.isFlagged = !this.isFlagged;
        this.htmlTile.innerHTML = (this.isFlagged) ? `<img class="flag" src="/icons/flag.svg" alt="La case est marquée.">` : "";
    }

    setHtmlTile(node){ this.htmlTile = node;}
    setAsMine() { this.isMine = true;}

    getNeighbours() {
        const up = -this.fieldSizeY;
        const down = this.fieldSizeY;
        let transforms = [up, up+1, 1, down+1, down, down-1, -1, up-1];

        let neighbours = transforms.map((e) => this.position + e);
        neighbours = neighbours.filter((e) => {
            if (e >= 0 && e < this.fieldSizeX * this.fieldSizeY) {
                return (!(this.position%this.fieldSizeY == 9 && e%this.fieldSizeY==0) && !(this.position%this.fieldSizeY == 0 && e%this.fieldSizeY==9));
            }
        });
        return neighbours;
    }
}

class GameClass {
    constructor() {
        this.currentPlayer = 0;
        this.players = JSON.parse(localStorage.getItem("t2p-players"));
        this.playerNameHtml = document.getElementById("playerName");

        this.sweeperInstance;
        this.timer = 60;

        this.messageBox = document.getElementById("minesweeperMessage");
        this.resultsBox = document.getElementById("minesweeperResults");
        this.nextPlayerButton = document.getElementById("minesweeperNextButton");
        this.resultsButton = document.getElementById("minesweeperResultsButton");
        this.nextPlayerButton.addEventListener("click", () => this.nextTurn());
        this.resultsButton.addEventListener("click", () => this.showResults());

        this.startTurn();
    }
    startTurn() {
        document.getElementById("flagCount")
        this.sweeperInstance = new MinesweeperClass(10, 10, 15);
        this.sweeperInstance.flagCounterHtml.textContent = "Au tour de " + this.players[this.currentPlayer].name;
        this.playerNameHtml.textContent = this.players[this.currentPlayer].name;
    }
    nextTurn() {
        this.currentPlayer++;
        this.messageBox.style.visibility = "hidden";
        this.timer = 60;
        this.startTurn();
    }
    calculateScore() {
        const timeScore = this.timer + 1/100 * 100;
        let score = 0;
        let divider = this.sweeperInstance.totalMines + 1;

        this.sweeperInstance.tiles.forEach (tile => tile.isClicked && score++);
        this.sweeperInstance.tiles.forEach (tile => tile.isMine && tile.isFlagged && divider--);

        score = score/(this.sweeperInstance.fieldSize - this.sweeperInstance.totalMines) * 100;
        divider = Math.max(divider/ this.sweeperInstance.totalMines * 10, 1);
        this.players[this.currentPlayer].minesweeperScore = Math.round((score * timeScore) / divider);
    }

    startTimer() {
        const gameInstance = this;
        const countDownDisplay = document.getElementById("timer");

        countDownDisplay.innerText = `Temps: 60s`;
        
        function tick () {
            gameInstance.timer--;
            countDownDisplay.innerText = `Temps: ${gameInstance.timer > 9 ? "" : "0"}${gameInstance.timer}s `;
            (gameInstance.timer < 11) ? countDownDisplay.style.color = "red" : "";
            if (gameInstance.timer <= 0) {
                gameInstance.sweeperInstance.gameRunning = false;
                clearInterval(gameInstance.ticker);
                gameInstance.calculateScore();
                gameInstance.displayMessage(" n'a plus de temps.")
            }
        }
        this.ticker = setInterval(tick, 1000);
    }
    stopTimer() {
        clearInterval(this.ticker);
    }
    displayMessage(message) {
        this.messageBox.children[0].textContent = this.players[this.currentPlayer].name + message;
        this.messageBox.style.visibility = "visible";
        if (this.currentPlayer >= this.players.length - 1) {
            this.nextPlayerButton.style.visibility = "collapse";
            this.resultsButton.style.visibility = "inherit";
        } else {
            this.nextPlayerButton.style.visibility = "inherit";
            this.resultsButton.style.visibility = "collapse";
        }
    }
    showResults() {
        this.messageBox.style.visibility = "hidden";
        this.resultsBox.style.visibility = "visible";
        let playerSorted = structuredClone(this.players);
        playerSorted.sort((a, b) => a.minesweeperScore - b.minesweeperScore);

        for (let i = 0; i < this.players.length; i++) {
            let playerIndex = this.players.findIndex(e => e.name == playerSorted[i].name);
            this.players[playerIndex].minesweeperScore = i+1;

            let newRow = document.createElement("div");
            newRow.className = "player-list-row";
            newRow.innerHTML = `
                <span>${this.players.length - i} <img class="icon-normal" src="/icons/caret-right-fill.svg" alt="Pointer droite"></span>
                <span>${playerSorted[i].name}</span>
            `;
            this.resultsBox.prepend(newRow);
        }
        localStorage.setItem("t2p-players", JSON.stringify(this.players));
    }
}
const game = new GameClass();