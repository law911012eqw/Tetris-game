'use strict'

const cvs = document.querySelector('canvas');
const ctx = cvs.getContext('2d');


//board properties
const BOX = 36;
const TOTALROW = 20;
const TOTALCOL = 10;
const FILLER = "rgba(24,36,36, 0.9)";
let board = [];

for(let r=0;r<TOTALROW;r++){
    board[r] = [];
    for(let c = 0;c<TOTALCOL;c++){
        board[r][c] = FILLER;
    }
}

function Piece(tetromino, color){
    this.tetromino = tetromino;
    this.tetrominoN = 0;
    this.activeTetromino = this.tetromino[this.tetrominoN];
    this.color = color;
    this.x = 3;
    this.y = -2;
}

function drawBoard() {
    for (let r = 0; r < TOTALROW; r++){ 
        for(let c = 0; c < TOTALCOL; c++) {
            drawSquare(c,r,board[r][c]);
        }
    }
}

drawBoard();

//draw and undrawthe tetronimo piecess
Piece.prototype.draw = function(){
    for(let r = 0; r < this.activeTetromino.length; r++){
        for(let c = 0; c < this.activeTetromino.length; r++){
            if(this.activeTetromino[r][c]){
                drawSquare(this.x + c, this.y + r, this.color);
            }
        }
    }
}

Piece.prototype.unDraw = function(){
    for(let r = 0; r < this.activeTetromino.length; r++){
        for(let c = 0; c < this.activeTetromino.length; r++){
            if(this.activeTetromino[r][c]){
                drawSquare(this.x + c, this.y + r, FILLER);
            }
        }
    }
}

Piece.prototype.moveDown = function(){
    this.unDraw();
    this.y++;
    this.draw();
}
Piece.prototype.moveLeft= function(){
    this.unDraw();
    this.y++;
    this.draw();
}
Piece.prototype.moveUp = function(){
    this.unDraw();
    this.y++;
    this.draw();
}
Piece.prototype.moveDown = function(){
    this.unDraw();
    this.y++;
    this.draw();
}
function drawSquare(x,y,color){
    ctx.fillStyle = color;
    ctx.fillRect(x*BOX,y*BOX,BOX,BOX);
    ctx.strokeStyle = "rgba(111,111,111,0.1)";
    ctx.strokeRect(x*BOX,y*BOX,BOX,BOX);
}

document.addEventListener("keydown", function(e){
    if(e.key == ArrowLeft){
        Piece.moveLeft();
    } else if(e.key == ArrowUp){
        Piece.rotate();
    } else if(e.key == ArrowRight){
        Piece.moveRight();
    } else if(e.key == ArrOWDown){
        Piece.moveDown();
    }
})

//function draw()
console.log(board);