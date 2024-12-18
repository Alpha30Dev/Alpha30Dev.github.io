class PlayFieldClass {
    constructor(sizeX, sizeY) {
        this.tiles = [];
        this.container = document.getElementById("minesweeper");
        for(let i = 0; i < (sizeX*sizeY); i++) {
            this.tiles.push(new TileClass());
            this.container.append(this.tiles[i].GetHtml());
        }
    }
}

class TileClass {
    constructor() {

    }
    GetHtml() {
        let newTile = document.createElement("div");
        newTile.className = "tile";
        newTile.innerHTML =  `
            <div class="tile">
                T
            </div>
        `;
        return newTile;
    }
}

const PlayField = new PlayFieldClass(10,10);