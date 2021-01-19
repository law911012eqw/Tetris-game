import helper from './helpers.js';
import bag from './bag.js';
'use strict'

//DOM stuff
const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');
const levelEl = document.querySelector('#modifiableVars > #level');
const highScoreEl = document.querySelector('#modifiableVars > #highScore');
const scoreEl = document.querySelector('#modifiableVars > #score');

//board properties
const BOX = 36;
const TOTALROW = 20;
const TOTALCOL = 10;
const FILLER = "rgba(24,36,36, 0.9)"; //unoccupied space 


//modifiable variables
let level = 1;
let lines = 0;
let score = 0;
let high = 0;

const defaultSpeed = 1000;

/*multiplies to the default drop speed
which is statically decremented each level*/
let spdMultiplier = 1;
let gameOver = false;

//get the high score if it exists
if (localStorage.getItem("savedHigh") !== null) {
    high = localStorage.getItem("savedHigh");
    highScoreEl.textContent = `High Score: ${high}`;
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
            drawSquare(c, r, board[r][c]);
        }
    }
}

function drawSquare(x, y, color) {
    context.fillStyle = color;
    context.fillRect(x * BOX, y * BOX, BOX, BOX);
    context.strokeStyle = "rgb(111,111,111,0.4)";
    context.strokeRect(x * BOX, y * BOX, BOX, BOX);
}

drawBoard();

//class consisting of initial pos, current active and properties
function Piece(tetromino, color) {
    this.color = color;
    this.tetromino = tetromino;
    //initial piece pattern
    this.tetrominoN = 0;
    //set the next piece to active state
    this.activeTetromino = this.tetromino[this.tetrominoN];
    /*forcing the tetronimoes to the initial pos
    when the piece is geenrated*/
    this.x = 3;
    this.y = -2;
}

// generate random pieces
function generateTetromino() {
    let r = Math.floor(Math.random() * TETROMINOES.length)
    return new Piece(TETROMINOES[r][0], TETROMINOES[r][1]);
}

let piece = generateTetromino();

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

            // Tetrominoes in the initial pos is an exception rule
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
Piece.prototype.fill = function (color) {
    for (let r = 0; r < this.activeTetromino.length; r++) {
        for (let c = 0; c < this.activeTetromino.length; c++) {
            if (this.activeTetromino[r][c]) {
                drawSquare(this.x + c, this.y + r, color);
            }
        }
    }
}

Piece.prototype.instantFill = function (color){
    for (let r = 0; r < this.activeTetromino.length; r++) {
        for (let c = 0; c < this.activeTetromino.length; c++) {
            if (board[c]) {
                drawSquare(this.x + c, this.y + r, color);
            }
        }
    }
}
//draw the tetrominoes
Piece.prototype.draw = function () {
    this.fill(this.color);
}

//undraw the tetrominoes
Piece.prototype.unDraw = function () {
    this.fill(FILLER);
}

//functionality when pressing keys
Piece.prototype.moveDown = function () {
    if (!this.collision(0, 1, this.activeTetromino)) {
        this.unDraw();
        this.y++;
        this.draw();
        score++;
    } else {
        this.lock();
        piece = generateTetromino();
    }
}

Piece.prototype.moveLeft = function () {
    if (!this.collision(-1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x--;
        this.draw();
    }
    else {
        this.lock();
        piece = generateTetromino();
    }
}

Piece.prototype.moveRight = function () {
    if (!this.collision(1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x++;
        this.draw();
    } else {
        this.lock();
        piece = generateTetromino();
    }
}

Piece.prototype.rotate = function () {
    let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];

    //shift to the opposite direction if it hits the wall
    if (this.collision(0, 0, nextPattern)) {
        this.x > TOTALCOL / 2 ? shift = -1 : shift = 1;
    }

    if (!this.collision(0, 0, nextPattern)) {
        this.unDraw();
        this.x += 0;
        //assigned the result as a 
        this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
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
        if (score > high) {
            high = score;
            localStorage.setItem("savedHigh", score);
        }
        //invokes the function per animation frame end until gameover
        requestAnimationFrame(drop);
    }
    else{
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
    }
}

//enable while in-game functionality
document.addEventListener("dblclick", function() { startGame() });

function startGame(){
    const displayC = document.getElementById("displayController");
    const startInstruct = document.getElementById("howToStart");

    //automatic tetromino fall
    drop();
    displayC.removeChild(startInstruct);
    console.log(gameOver);

    //add tetrominoes movement
    document.addEventListener("keydown", function(e){tetrominoMovement(e)});
}
