const countDownDisplay = document.getElementById("count-down");
let previousBoard = [];
let score = 0;
let grid = Array.from({ length: 16 }, () => 0);
let result = document.getElementById("container-cell");
let seconds = 59;
let ticker;


function generate() {

    let compare = false;
    grid.forEach ((e,i)=> (e != previousBoard[i]) && (compare = true));
    if(compare == false){
        return;
    }
    let isGenerated = false;
    let rnd = Math.floor(Math.random() * grid.length);
    let counter = 0;
   console.log(grid)
    while(isGenerated == false) {
       
        if (grid[rnd] == 0) {
            grid[rnd] = 2;
            isGenerated = true;
        } else {
            rnd++;
            if (rnd == grid.length) rnd = 0;
        }
        counter++
        if (counter == grid.length) isGenerated = true
    }
}
generate();
generate();
update();

function update(){      /*Actualise le tableau*/
    for(let i = 0; i < grid.length; i++){
        result.children[i].id = "color" + grid[i];
        result.children[i].textContent = "";
        if(grid[i] !== 0){
            result.children[i].textContent = grid[i];
        }
    }
    if(verifyLoose() == false){
        finishGame();
    }
}

let body = document.querySelector("body");
body.addEventListener("keydown", (e)=> {
    
    if (e.key === "ArrowUp"){
        previousBoard = [...grid]
        generate();
        moveUp();
        countDown();
    }else if (e.key ===  "ArrowDown"){
        previousBoard = [...grid]
        generate();
        moveDown();
        countDown();
    }else if (e.key === "ArrowLeft"){
        previousBoard = [...grid]
        moveLeft();
        generate(); 
        countDown();
    }else if (e.key === "ArrowRight"){
        previousBoard = [...grid]
        moveRight();
        generate();
        countDown();
    }
});

function moveRight() {

    for (let j = 0; j < 4; j++) {       /* j = index de la boucle qui sert à calculer sur toutes les rows*/

        let sp = j * 4;     /*calcule la position de depart en utilisant j et vas de ligne en ligne*/
        let line = [];      /*une ligne*/
        
        for (let i = 0; i < 4; i++) {       /*récupère la ligne*/
            line.push(grid[sp + i]);
        }

        line = translate(line);     /*viens les déplacer [16,4,4,32]*/
        line = calculate(line);     /*sert à calculer [0,16,8,32]*/
        line = translate(line);     /*viens le mettre dans le bon ordre (à droite dans le cas où il y a des espaces [4,4,4,0] --> [0,0,4,8]*/
      
        for (let i = 0; i < 4; i++) {       /*boucle sert à insérer les nouvelles valeurs dans grid*/
            grid[sp + i] = line[i];
        }
    }
        generate();     /*ajoute une tuile*/
        update();       /*actualise le tableau / met à jour l'affichage*/
}

function moveLeft() {

    for (let j = 0; j < 4; j++) {
        let sp = j * 4;
        let line = [];
        
        for (let i = 3; i >= 0; i--) {
            line.push(grid[sp + i]); 
        }
      
        line = translate(line);
        line = calculate(line);
        line = translate(line);
      
         for (let i = 3; i >= 0; i--) {
            grid[sp + 3 - i] = line[i];
        }
    }
    generate();
    update();
}

function moveDown() {

    for (let j = 0; j < 4; j++) {
        let sp = j;
        let line = [];
        
        for (let i = 3; i >= 0; i--) {
            line.unshift(grid[sp + (i * 4)]); 
        }
      
        line = translate(line);
        line = calculate(line);
        line = translate(line);
      
        for (let i = 3; i >= 0; i--) {
             grid[sp + (i * 4)] = line[i];
        }
    }
    generate();
    update();
}

function moveUp() {

    for (let j = 0; j < 4; j++) {
        let sp = 12 + j;
        let line = [];
        
        for (let i = 0; i < 4; i++) {
            line.push(grid[sp - (i * 4)]); 
        }
      
        line = translate(line);
        line = calculate(line);
        line = translate(line);
      
        for (let i = 0; i < 4; i++) {
             grid[sp - (i * 4)] = line[i];
        }
    }
    generate();
    update();
}

function calculate(array) {         /*va servir à additionner les tuiles de meme valeur et adjacentes*/
    let checkTiles = array[0];      /*sert à stocker la tuile précédente*/
    for (let i = 4; i >= 0; i--) {      /*boucle permettant de comparer avec la tuile suivante*/
      if (checkTiles === array[i] && array[i] !== 0) {
        array[i + 1] += array[i];
        array[i] = 0;
      }
      checkTiles = array[i];        /*va venir chercher la tuile actuelle qui va devenir la tuile précédente pour être comparer avec la prochaine etc etc*/
    }
  return array;
}

function translate(array) {     /*fonction permettant de déplacer les tuiles*/
    let newLine = [];

    for (let i = 3; i >= 0; i--) {      /*va venir boucler sur toute la ligne et va venir l'ajouter dans le tableau*/
        if (array[i] !== 0) {
            newLine.unshift(array[i]);
        }
    }
    while (newLine.length < 4) {        /*viens ajouter les 0 s'il y a des cases vides*/
        newLine.unshift(0);
    }
    return newLine;
}

function verifyLoose() {
    for(let i = 0; i < grid.length; i++) {
        if (grid[i] == 0) return true;
    }
    
    for (let j = 0; j < 4; j++) {   //Verifier sur l'axe horisontal vers la droite
        let sp = j * 4;
        let line = [];
        for (let i = 0; i < 4; i++) {
            line.push(grid[sp + i]); 
        }
        if (checkPosibility(translate(line)) == true) return true;
    }
    
    for (let j = 0; j < 4; j++) {   //Verifier sur l'axe horisontal vers la gauche
        let sp = j * 4;
        let line = [];
        
        for (let i = 3; i >= 0; i--) {
            line.push(grid[sp + i]); 
        }
        if (checkPosibility(translate(line)) == true) return true;
    }
    
    for (let j = 0; j < 4; j++) {   //Verifier sur l'axe vertical vers le bas
        let sp = j;
        let line = [];
        
        for (let i = 3; i >= 0; i--) {
            line.unshift(grid[sp + (i * 4)]); 
        }
        if (checkPosibility(translate(line)) == true) return true;
    }
    
    for (let j = 0; j < 4; j++) {   //Verifier sur l'axe vertical vers le haut
        let sp = 12 + j;
        let line = [];
        
        for (let i = 0; i < 4; i++) {
            line.push(grid[sp - (i * 4)]); 
        }
        if (checkPosibility(translate(line)) == true) return true;
    }
    return false;
}

function checkPosibility(array) {
    let checkTiles = array[0];
    for (let i = 4; i >= 0; i--) {
        if (checkTiles === array[i] && array[i] !== 0) return true;
        checkTiles = array[i];
    }
    return false;
}



const countDown = () => {
    if(ticker){
        return;
    }
    ticker = setInterval(tick, 1000)
console.log(ticker)
}
function tick () {

    seconds--

    countDownDisplay.innerText = `Time: ${seconds > 9 ? "" : "0"}${seconds}s`;
    seconds < 11 ? countDownDisplay.style.color = "red" : "";
    if (seconds === 0) {clearInterval(ticker)}

}

// function score(){

// }

function finishGame(){
    alert("La partie est terminée. Merci d'avoir joué. Vous voulez réssayer ? NON ! COMMENT CA NON ! Laisse moi Thierry ! Bien sur que je m'enerve il ne veut pas recommencer.");
    restartGame();
}

function restartGame(){
    clearInterval(ticker)
    ticker = undefined;
    grid.fill(0);
    generate();
    generate();
    update();
    seconds = 60;
}




// 100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000