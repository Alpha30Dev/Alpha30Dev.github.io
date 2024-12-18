class PlayFieldClass {
    constructor(sizeX, sizeY, mines) {
        this.tiles = [];
        this.container = document.getElementById("minesweeper");
        this.fieldSize = sizeX * sizeY;

        this.totalMines = mines;
        this.generatedMines = 0;

        for(let i = 0; i < this.fieldSize; i++) {
            this.tiles.push(new TileClass(sizeX, sizeY));
            this.container.append(this.tiles[i].getHtml());
        }
        this.generateMines();
    }
    generateMines() {
        let rnd;
        let tile;
        for(let i = 0; i < this.fieldSize; i++) {
            tile = this.tiles[i];
            rnd = (Math.round(Math.random() * this.fieldSize));
            if (tile.isMine == false && rnd < this.totalMines) {
                this.generatedMines++;
                tile.setAsMine();
                if (this.generatedMines == this.totalMines) return;
            }
        }
        if (this.generatedMines < this.totalMines) this.generateMines();
    }
}

class TileClass {
    constructor(fieldSizeX, fieldSizeY) {
        this.fieldSizeX = fieldSizeX;
        this.fieldSizeY = fieldSizeY;
        this.isMine = false;
        this.isFlagged = false;
        this.htmlTile;
        this.tileContent = "";
    }
    getHtml() {
        this.htmlTile = document.createElement("div");
        this.htmlTile.className = "tile";
        this.htmlTile.addEventListener("click", () => this.leftClick());
        this.htmlTile.addEventListener("contextmenu", (e) => this.rightClick(e));
        return this.htmlTile;
    }
    leftClick() {
        this.htmlTile.className += " clicked";
        this.updateHtml();
    }
    rightClick(e) {
        e.preventDefault();

        this.isFlagged = !this.isFlagged;
        if (this.isFlagged) this.tileContent = `<img class="flag" src="/icons/flag.svg" alt="La case est marquée.">`;
        else this.tileContent = ``;

        this.updateHtml();
    }
    updateHtml() {
        this.htmlTile.innerHTML = this.tileContent;
    }
    setAsMine() {
        this.isMine = false;
        this.tileContent = `<img class="mine" src="/icons/bomb.svg" alt="La case est une mine.">`;
        this.getNeighbours()
    }
    getNeighbours() {
        const up = -this.fieldSizeY;
        const down = this.fieldSizeY;
        const left = -1;
        const right = 1;
        const upRight = up + right;
        const downRight = down + right;
        const upLeft = up + left;
        const downLeft = down + left;
        let neighbours = [up, upRight, right, downRight, down, downLeft, left, upLeft];

        neighbours = neighbours.map((e) => this.position - e)
        neighbours = neighbours.filter((e) => {
            if (e >= 0) {
                return (());
            }
        });
        console.log(neighbours);
    }
}

const PlayField = new PlayFieldClass(10,10, 20);