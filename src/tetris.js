import helper from './helpers.js';
import generate from './bag.js';
'use strict'

//DOM stuff
//main canvas
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

//tetrominoes canvas 
const holdCanvas = document.getElementById('hold-piece');
const holdContext = holdCanvas.getContext('2d');

//level and scores
const levelEl = document.querySelector('#modifiableVars > #level');
const scoreEl = document.querySelector('#modifiableVars > #score');

//DOM instances for high scores
const highScoreEl = document.querySelector('#high-scores > #high-score1');
const highScoreEl2 = document.querySelector('#high-scores > #high-score2');
const highScoreEl3 = document.querySelector('#high-scores > #high-score3');
const highScoreEl4 = document.querySelector('#high-scores > #high-score4');
const highScoreEl5 = document.querySelector('#high-scores > #high-score5');

//board properties
const BOX = 36;
const TOTALROW = 20;
const TOTALCOL = 10;
//"rgba(24,36,36, 0.9)" - old filler color
const FILLER = "rgba(24,36,36, 0.9)"; //unoccupied space 
const T_BOX = 45;

//modifiable variables
let level = 1;
let lines = 0;
let score = 0;

//highscores
let high = 0;
let high2 = 0;
let high3 = 0;
let high4 = 0;
let high5 = 0;

const defaultSpeed = 1000;

/*multiplies to the default drop speed
which is statically decremented each level*/
let spdMultiplier = 1;
let gameOver = false;

//get the high scores if it exists
if (localStorage.getItem("savedHigh") !== null) {
    high = localStorage.getItem("savedHigh");
    highScoreEl.textContent = `1: ${high}`;
}
if (localStorage.getItem("savedHigh2") !== null) {
    high2 = localStorage.getItem("savedHigh2");
    highScoreEl2.textContent = `2: ${high2}`;
}

if (localStorage.getItem("savedHigh3") !== null) {
    high3 = localStorage.getItem("savedHigh3");
    highScoreEl3.textContent = `3: ${high3}`;
}

if (localStorage.getItem("savedHigh4") !== null) {
    high4 = localStorage.getItem("savedHigh4");
    highScoreEl4.textContent = `4: ${high4}`;
}

if (localStorage.getItem("savedHigh5") !== null) {
    high5 = localStorage.getItem("savedHigh5");
    highScoreEl5.textContent = `5: ${high5}`;
}


//display game over modal
function displayGameOver() {
    const canvasModal = document.getElementById('canvasContainer');
    const modal = helper.createModal('game-over-modal','modal');
    const modalBox = helper.createElement('','game-over-box', 'modal-box','div');
    const gameOverText = helper.createElement("Game Over",'game-over-text','modal-text','p');
    const tryAgainBtn = helper.createElement('Try Again','play-again-btn','modal-btn','button');
    helper.modifyAttr(modalBox,'style','background: white;');
    helper.modifyAttr(canvasModal,'style',`background: rgba(1,1,1,0.2);`);
    modal.appendChild(modalBox);
    modalBox.append(gameOverText,tryAgainBtn);
    document.getElementById('canvasContainer').append(modal);
}

//create the board object
let board = [];
for (let r = 0; r < TOTALROW; r++) {
    board[r] = [];
    for (let c = 0; c < TOTALCOL; c++) {
        board[r][c] = FILLER;
    }
}

//visual board
function drawBoard() {
    for (let r = 0; r < TOTALROW; r++) {
        for (let c = 0; c < TOTALCOL; c++) {
            drawSquare(context, c, r, board[r][c], BOX);
        }
    }
}

function drawSquare(ctx, x, y, color, size) {
    ctx.fillStyle = color;
    ctx.fillRect(x * size, y * size, size, size);
    ctx.strokeStyle = "rgb(111,111,111,0.4)";
    ctx.strokeRect(x * size, y * size, size, size);
}

function clearCanvas(ctx) {
    ctx.clearRect(0, 0, 280, 140);
}
drawBoard();

//class consisting of initial pos, current active and properties
function Piece(tetromino, color) {
    this.color = color;
    this.tetromino = tetromino;
    //initial piece pattern
    this.tetrominoN = 0;
    this.tetrominoFirst = this.tetromino[0];
    //set the next piece to active state
    this.activeTetromino = this.tetromino[this.tetrominoN];
    this.holdTetromino = null;
    /*forcing the tetronimoes to the initial pos
    when the piece is geenrated*/
    this.x = 3;
    this.y = -2;
}

//generate a bag of tetrominoes
generate.tetrotetro();
let bag = generate.getBag();

//generate random order pieces until it resets to generate again when it's empty
function generatePiece(){
    if (bag.length === 0) { 
        generate.newBag();
        generate.tetrotetro(); 
        bag = generate.getBag();
    }
    console.log(generate.getBag());
    let r = getPiece();

    return new Piece(TETROMINOES[r][0], TETROMINOES[r][1]);
}

//get the current piece from the generator function
function getPiece(){
    let r = generate.getPiece(0);
    generate.current = bag.shift();
    return r;
}

//assigned random tetromino as a current piece
let piece = generatePiece();

Piece.prototype.lock = function () {
    for (let r = 0; r < this.activeTetromino.length; r++) {
        for (let c = 0; c < this.activeTetromino.length; c++) {
            // unoccupied spaces are ignored
            if (!this.activeTetromino[r][c]) {
                continue;
            }
            // lock once a tetromino sqr reached the forbidden index
            if (this.y + r < 0) {
                gameOver = true;
                break;
            }
            // lock the piece
            board[this.y + r][this.x + c] = this.color;
        }
    }
    if (enableHold === false) { enableHold = true; }
    // remove full rows
    for (let r = 0; r < TOTALROW; r++) {
        let isRowFull = true;
        for (let c = 0; c < TOTALCOL; c++) {
            isRowFull = isRowFull && (board[r][c] != FILLER);
        }
        if (isRowFull) {
            //filled rows are cleared
            for (let y = r; y > 1; y--) {
                for (let c = 0; c < TOTALCOL; c++) {
                    board[y][c] = board[y - 1][c];
                }
            }
            // the top row board[0][..] has no row above it
            for (let c = 0; c < TOTALCOL; c++) {
                board[0][c] = FILLER;
            }
            //increment lines and score
            score += 30;
            lines++;
            if (lines > level * (4 * 1.2)) {
                level++;
                levelEl.textContent = `Level: ${level}`;
                spdMultiplier -= 0.05;
            }
        }
    }
    // update the board
    drawBoard();

    // update the score
    scoreEl.textContent = `Score: ${score}`;
}

Piece.prototype.collision = function (x, y, piece) {
    for (let r = 0; r < piece.length; r++) {
        for (let c = 0; c < piece.length; c++) {

            // the new coordinates after position change
            let newX = this.x + c + x;
            let newY = this.y + r + y;

            // skip the empty line from the piece
            if (!piece[r][c]) {
                continue;
            }

            // Tetromino in the initial pos is an exception rule
            if (newY < 0) {
                continue;
            }

            // conditions to implement collision system 
            if (newX < 0 || newX >= TOTALCOL || newY >= TOTALROW) {
                console.log("collide");
                return true;
            }

            // check existing locked pieces
            if (board[newY][newX] != FILLER) {
                return true;
            }
        }
    }
    return false;
}

Piece.prototype.instantDrop = function () {
    this.unDraw();
    this.y + 20;
    this.draw();
}

//add filler or refill the board with tetromino pieces
Piece.prototype.fill = function (ctx, color) {
    for (let r = 0; r < this.activeTetromino.length; r++) {
        for (let c = 0; c < this.activeTetromino.length; c++) {
            if (this.activeTetromino[r][c]) {
                drawSquare(ctx, this.x + c, this.y + r, color, BOX);
            }
        }
    }
}

Piece.prototype.displayTetrominoes = function (ctx){
    clearCanvas(holdContext);
    for (let r = 0; r < this.activeTetromino.length; r++) {
        for (let c = 0; c < this.activeTetromino.length; c++) {
            if (this.activeTetromino[r][c]) {
                drawSquare(ctx, c+1.5, r, this.color, T_BOX);
                console.log(c, r);
            }
        }
    }
}
//draw the tetrominoes
Piece.prototype.draw = function (ctx) {
    this.fill(ctx, this.color);
}

//undraw the tetrominoes
Piece.prototype.unDraw = function (ctx) {
    this.fill(ctx, FILLER);
}

Piece.prototype.display = function () {
    drawSquare(holdContext, this.x, this.y, this.color, BOX);
}

//functionality when pressing keys
Piece.prototype.moveDown = function () {
    if (!this.collision(0, 1, this.activeTetromino)) {
        this.unDraw(context);
        this.y++;
        this.draw(context);
        score++;
    } else {
        this.lock();
        piece = generatePiece();
    }
}

Piece.prototype.moveLeft = function () {
    if (!this.collision(-1, 0, this.activeTetromino)) {
        this.unDraw(context);
        this.x--;
        this.draw(context);
    }
    else {
        this.lock();
        piece = generatePiece();
    }
}

Piece.prototype.moveRight = function () {
    if (!this.collision(1, 0, this.activeTetromino)) {
        this.unDraw(context);
        this.x++;
        this.draw(context);
    } else {
        this.lock();
        piece = generatePiece();
    }
}

Piece.prototype.rotate = function () {
    let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];

    //shift to the opposite direction if it hits the wall
    if (this.collision(0, 0, nextPattern)) {
        this.x > TOTALCOL / 2 ? shift = -1 : shift = 1;
    }

    if (!this.collision(0, 0, nextPattern)) {
        this.unDraw(context);
        this.x += 0;
        //assigned the result as a 
        this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw(context);
    }
}

//hold the current piece
//it disables after using once until dropping the piece
let enableHold = true;
Piece.prototype.hold = function() {
    if (generate.hold.length === 0 && enableHold === true){
        //trash is always the current piece freshly coming from the bag
        //assigning the trash to the current
        generate.hold = generate.current;

        //undraw the hold and draw the current
        this.unDraw(context);
        piece = generatePiece();

        enableHold = false;
        this.displayTetrominoes(holdContext);
        console.log('should only work once');
    }
    else if(enableHold === true && generate.hold.length !== 0){
        //swap the position of the hold and current piece
        generate.holdToCurrent(generate.hold); 
        generate.hold = generate.current; 
        this.unDraw(context);

        //generate the swapped piece
        piece = generatePiece();

        this.displayTetrominoes(holdContext);
        enableHold = false;
    }
    console.log(`hold is ${generate.hold} and current piece is ${generate.current}`);
}
// drop the piece, one row every second
let start = Date.now();

function drop() {
    let now = Date.now();
    let sec = now - start;
    if (sec > defaultSpeed * spdMultiplier) {
        piece.moveDown();
        start = Date.now(); //reset to now
    }
    if (!gameOver) {
        //invokes the function per animation frame end until gameover
        requestAnimationFrame(drop);
    }
    else {
        //high score system
        let currentScore = 0; //temporary var for current score
        let temp = 0; //temporary var for all high scores
        currentScore = score;
        if (score > localStorage.getItem("savedHigh")) {
            temp = localStorage.getItem("savedHigh");
            localStorage.setItem("savedHigh", score);
            score = temp;
        } 
        if (score > high2) {
            temp = localStorage.getItem("savedHigh2");
            localStorage.setItem("savedHigh2", score);
            score = temp;
        } 
        if (score > high3) {
            temp = localStorage.getItem("savedHigh3");
            localStorage.setItem("savedHigh3", score);
            score = temp;
        } 
        if (score > high4) {
            temp = localStorage.getItem("savedHigh4");
            localStorage.setItem("savedHigh4", score);
            score = temp;
        } 
        if (score > high5) {
            temp = localStorage.getItem("savedHigh5");
            localStorage.setItem("savedHigh5", score);
        }
        score = currentScore;
        displayGameOver();
        document.getElementById('play-again-btn').onclick = () => location.reload();
    }
    console.log(lines);
}

function tetrominoMovement(e) {
    if (e.key === 'ArrowLeft') {
        piece.moveLeft();
    } else if (e.key === 'ArrowUp') {
        piece.rotate();
    } else if (e.key === 'ArrowRight') {
        piece.moveRight();
    } else if (e.key === 'ArrowDown') {
        piece.moveDown();
        scoreEl.textContent = `Score: ${score}`;
    } else if (e.key === ' ') {
        console.log("insta!!");
        piece.instantDrop();
    } else if (e.key === 'C' || e.key === 'c') {
        piece.hold();
    }
}

//enable while in-game functionality
document.addEventListener("dblclick", function() { 
    startGame() ;
}, { once: true }); //Can only be invoked once

document.removeEventListener("dblclick", startGame);
function startGame(){
    const displayC = document.getElementById("displayController");
    const startInstruct = document.getElementById("howToStart");

    //automatic tetromino fall in a relative speed
    drop();
    if(displayC.contains(startInstruct)){
        displayC.removeChild(startInstruct);
    }
    //add tetrominoes movement
    document.addEventListener("keydown", function(e){tetrominoMovement(e)});
}
