class IndexPageClass {
    constructor () {
        this.playerInput = document.getElementById("name-input");
        this.playerAdd = document.getElementById("add-button");
        this.startButton = document.getElementById("start-button");
        this.playerList = new PlayerList();

        this.playerAdd.addEventListener("click", () => this.addPlayer());
        this.playerInput.addEventListener("keydown", (e) => this.addPlayer(e));
        this.startButton.addEventListener("click", () => this.startTournament());
    }
    addPlayer(e) {
        if (e) {
            if (e.key != "Enter") return;
        }
        this.playerInput.value = this.removeSpecialChars(this.playerInput.value);
        if (this.playerInput.value.length > 50 || this.playerInput.value.length < 1) {
            alert("Le nom du joueur doit être entre 1 et 50 lettres.");
            return;
        }
        this.playerList.addPlayerRow(this.playerInput.value);
        this.playerInput.value = "";
    }
    startTournament() {
        if (this.playerList.list.length <= 0) {
            alert("Aucun joueurs n'a été ajouté.");
            return;
        }
        let playersJson = "["
        this.playerList.list.forEach((element, index) => {
            playersJson += `{
            "name":"${element.dataset.name}",
            "wordleScore":0,
            "hangmanScore": 0,
            "snakeScore": 0,
            "minesweeperScore": 0,
            "game2048": 0
            }`;

            //Si on n'est pas a la fin de la liste, ajouter une virgule.
            if (index < this.playerList.list.length - 1) playersJson += ",";
        });
        playersJson += "]";
        localStorage.setItem("t2p-players", playersJson);
    }
    removeSpecialChars (text) {
        return text.replace(/[&<>"']/g, "");
    }
}

class PlayerList {
    constructor() {
        this.playerList = document.querySelector(".player-list");
        this.playerCounter = document.getElementById("player-counter");
        this.list = [];
    }
    addPlayerRow(playerName) {
        if (this.getPlayerIndex(playerName) != -1) {
            alert("Ce joueur a déjà été ajouté");
            return;
        }
        
        let newIndex = this.list.length;
        let newRow = document.createElement("div");
        let newButton = document.createElement("button");

        this.playerCounter.textContent = newIndex + 1;

        newButton.textContent = "Retirer";
        newButton.addEventListener("click", () => this.removeRow(playerName));

        newRow.className = "player-list-row";
        newRow.dataset.name =  playerName;
        newRow.innerHTML = `
                <span><img class="icon-normal" src="/icons/caret-right-fill.svg" alt="Pointer droite"> ${playerName}</span>
        `;
        newRow.appendChild(newButton);

        this.list.push(newRow);
        this.playerList.appendChild(newRow);
    }
    removeRow(playerName) {
        const rowIndex = this.getPlayerIndex(playerName);
        const rowNode = this.list[rowIndex];

        this.list.splice(rowIndex, 1);

        if(this.list.length > 0) this.playerCounter.textContent = this.list.length;
        else this.playerCounter.textContent = "Aucun joueurs";

        this.playerList.removeChild(rowNode);
    }
    getPlayerIndex(playerName) {
        return this.list.findIndex ((element) => element.dataset.name == playerName);
    }
}

const IndexPage = new IndexPageClass();