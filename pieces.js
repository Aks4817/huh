var pictures = {
    "bishop": new Image(),
    "pawn": new Image(),
    "knight": new Image(),
    "king": new Image(),
    "queen": new Image(),
    "nightrider": new Image(),
    "wazir": new Image(),
    "ferz": new Image(),
    "alfil": new Image(),
    "elk": new Image(),
    "flyingcat": new Image(),
    "bishight": new Image(),
    "chamknight": new Image(),
    "chambishop": new Image(),
    "chamrook": new Image(),
    "chamqueen": new Image(),
    "cannon": new Image(),
    "cannonball": new Image(),
    "wizardstork": new Image(),
    "waffle": new Image(),
    "root50leaper": new Image(),
    "alfilrider": new Image(),
    "huygens": new Image(),
    "rook": new Image()
}

var picNames = Object.keys(pictures);

var loaded = 0;

for(i of picNames){
    pictures[i].src = `./assets/pieces/${i}.png`;
    pictures[i].onload = (e) => {
        console.log(loaded);
        if(++loaded == picNames.length){
            chessBoard = new Board(8, 8);
            loadBoard(coolBoard);
            initSocket();
        }
    }
    //pictures[i].style.filter = "invert(100%)";
}

var tPics = {};

var pieces = [];
var piecesToRemove = [];

function Piece(x, y, color){
    this.x = x;
    this.y = y;
    this.color = color;
    this.desc = "Just like in normal chess.";
    this.name = "Piece";
    this.state = 0;
    this.stateUp = () => {};
    this.update = (board) => {};
    this.moveUpdate = (board) => {

    };
    this.drawQueue = false;
    this.moves = (board) => {return []};
}

function Pawn(x, y, color){
    pieces.push(this);
    this.piece = new Piece(x, y, color);
    this.piece.img = "pawn";
    this.piece.name = "Pawn";
    this.piece.desc = "Just like in normal chess.";
    this.piece.update = (board) => {
        if(this.piece.y == 0 && this.piece.color == "w"){
            board.board[this.piece.y][this.piece.x] = new Queen(this.piece.x, this.piece.y, "w");
        }
        if(this.piece.y == board.board.length - 1 && this.piece.color == "b"){
            board.board[this.piece.y][this.piece.x] = new Queen(this.piece.x, this.piece.y, "b");
        }
    }
    this.piece.moves = (board) => {
        let valid = [];
        var dir = this.piece.color=="w"?-1:1;

        if(!board.get(this.piece.x, this.piece.y + dir)){
            valid.push([this.piece.x, this.piece.y + dir, (move)=>{
                board.board[this.piece.y][this.piece.x] = 0;
                this.piece.y += dir;
                board.board[this.piece.y][this.piece.x] = this;
            }]);
        }

        if(((this.piece.color == "w" && this.piece.y == board.board.length - 2) || (this.piece.color == "b" && this.piece.y == 1)) && !board.get(this.piece.x, this.piece.y + 2 * dir) && !board.get(this.piece.x, this.piece.y + dir)){
            valid.push([this.piece.x, this.piece.y + 2 * dir, (move)=>{
                board.board[this.piece.y][this.piece.x] = 0;
                this.piece.y += 2 * dir;
                board.board[this.piece.y][this.piece.x] = this;
            }]);
        }

        if(board.get(this.piece.x - 1, this.piece.y + dir)){
            if(board.get(this.piece.x - 1, this.piece.y + dir).piece.color != this.piece.color){
                valid.push([this.piece.x - 1, this.piece.y + dir, (move)=>{
                    board.board[this.piece.y][this.piece.x] = 0;
                    this.piece.x -= 1;
                    this.piece.y += dir;
                    board.board[this.piece.y][this.piece.x] = this;
                }])
            }
        }

        if(board.get(this.piece.x + 1, this.piece.y + dir)){
            if(board.get(this.piece.x + 1, this.piece.y + dir).piece.color != this.piece.color){
                valid.push([this.piece.x + 1, this.piece.y + dir, (move)=>{
                    board.board[this.piece.y][this.piece.x] = 0;
                    this.piece.x += 1;
                    this.piece.y += dir;
                    board.board[this.piece.y][this.piece.x] = this;
                }])
            }
        }
        if(board.get(this.piece.x - 1, this.piece.y) && board.get(this.piece.x - 1, this.piece.y).constructor == Pawn && board.get(this.piece.x - 1, this.piece.y).piece.color != this.piece.color){
            if(board.getLast(this.piece.x - 1, this.piece.y + 2 * dir) == board.get(this.piece.x - 1, this.piece.y)){
                valid.push([this.piece.x - 1, this.piece.y + dir, (move) => {
                    board.board[this.piece.y][this.piece.x] = 0;
                    board.board[this.piece.y][this.piece.x - 1] = 0;
                    this.piece.x = move[0];
                    this.piece.y = move[1];
                    board.board[this.piece.y][this.piece.x] = this;
                }]);
            }
        }

        if(board.get(this.piece.x + 1, this.piece.y) && board.get(this.piece.x + 1, this.piece.y).constructor == Pawn && board.get(this.piece.x + 1, this.piece.y).piece.color != this.piece.color){
            if(board.getLast(this.piece.x + 1, this.piece.y + 2 * dir) == board.get(this.piece.x + 1, this.piece.y)){
                valid.push([this.piece.x + 1, this.piece.y + dir, (move) => {
                    board.board[this.piece.y][this.piece.x] = 0;
                    board.board[this.piece.y][this.piece.x + 1] = 0;
                    this.piece.x = move[0];
                    this.piece.y = move[1];
                    board.board[this.piece.y][this.piece.x] = this;
                }]);
            }
        }

        return valid;
    }
}

function Bishop(x, y, color){
    pieces.push(this);
    this.piece = new Piece(x, y, color);
    this.piece.name = "Bishop";
    this.piece.img = "bishop";
    this.piece.desc = "Just like in normal chess.";
    this.piece.moves = (board) => {
        return ride([[-1, 1], [-1, -1], [1, 1], [1, -1]], this, board);
    }
}
function Waffle(x, y, color){
    pieces.push(this);
    this.piece = new Piece(x, y, color);
    this.piece.name = "Waffle";
    this.piece.img = "waffle";
    this.piece.desc = "Combination of alfil and wazir.";
    this.piece.moves = (board) => {
        return step([[-2, 2], [-2, -2], [2, 2], [2, -2], [0,1], [1,0], [-1,0], [0,-1]], this, board);
    }
}
function Bishight(x, y, color){
    pieces.push(this);
    this.piece = new Piece(x, y, color);
    this.piece.img = "bishight";
    this.piece.name = "Bishnight";
    this.piece.desc = "Moves like a bishop forwards, but a knight backwards.";
    this.piece.moves = (board) => {
        var dir = this.piece.color=="w"?-1:1;
        var valid = ride([[-1, dir], [1, dir]], this, board);
        valid.push(...step([[-2, -dir], [-1, -2 * dir], [1, -2 * dir], [2, -dir]], this, board));
        return valid;
    }
}
function WizardStork(x, y, color){
    pieces.push(this);
    this.piece = new Piece(x, y, color);
    this.piece.img = "wizardstork";
    this.piece.name = "Wizard Stork";
    this.piece.desc = "Moves like a queen, but can't go straight forward or diagonally back.";
    this.piece.moves = (board) => {
        var dir = this.piece.color=="w"?-1:1;
        
        return ride([[1, 0], [-1, 0], [-1, dir], [1, dir], [0, -dir]], this, board);
    }
}
function Alfil(x, y, color){
    pieces.push(this);
    this.piece = new Piece(x, y, color);
    this.piece.img = "alfil";
    this.piece.name = "Alfil";
    this.piece.desc = "Jumps exactly 2 squares diagonally. Not a good piece.";
    this.piece.moves = (board) => {
        return step([[-2, 2], [-2, -2], [2, 2], [2, -2]], this, board);
    }
}
function Alfilrider(x, y, color){
    pieces.push(this);
    this.piece = new Piece(x, y, color);
    this.piece.img = "alfilrider";
    this.piece.name = "Alfilrider";
    this.piece.desc = "Jumps 2 squares diagonally as many times as it wants.";
    this.piece.moves = (board) => {
        return ride([[-2, 2], [-2, -2], [2, 2], [2, -2]], this, board);
    }
}
function Ferz(x, y, color){
    pieces.push(this);
    this.piece = new Piece(x, y, color);
    this.piece.img = "ferz";
    this.piece.name = "Ferz";
    this.piece.desc = "Moves 1 square diagonally. Used to exist in place of a queen.";
    this.piece.moves = (board) => {
        return step([[-1, 1], [-1, -1], [1, 1], [1, -1]], this, board);
    }
}
function Chameleon(x, y, color, state){
    pieces.push(this);
    this.piece = new Piece(x, y, color);
    this.piece.img = "chamknight";
    this.piece.name = "Chameleon";
    this.piece.state = (state != undefined)?state:0;
    if(this.piece.color == "b"){
        this.piece.state = 3;
        this.piece.img = "chamqueen";
    }
    this.piece.desc = "Cycles each turn through knight, bishop, rook, and queen. Changes at the start of your turn.";
    this.piece.moves = (board) => {
        valid = [];
        switch((this.piece.state) % 4){
            case 0:
                valid = step([[2, 1], [2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2], [-2, 1], [-2, -1]], this, board);
                break;
            case 1:
                valid = ride([[-1, 1], [-1, -1], [1, 1], [1, -1]], this, board);
                break;
            case 2:
                valid = ride([[0, 1], [0, -1], [1, 0], [-1, 0]], this, board);
                break;
            case 3:
                valid = ride([[0, 1], [0, -1], [1, 0], [-1, 0], [-1, 1], [-1, -1], [1, 1], [1, -1]], this, board);
                break;
        }
        return valid;
    }
    this.piece.moveUpdate = (board) => {
        this.piece.state++;
        switch((this.piece.state) % 4){
            case 0:
                this.piece.img = "chamknight";
                break;
            case 1:
                this.piece.img = "chambishop";
                break;
            case 2:
                this.piece.img = "chamrook";
                break;
            case 3:
                this.piece.img = "chamqueen";
        }
        this.piece.drawQueue = true;
    }
    this.piece.stateUp = () => {
        switch((this.piece.state) % 4){
            case 0:
                this.piece.img = "chamknight";
                break;
            case 1:
                this.piece.img = "chambishop";
                break;
            case 2:
                this.piece.img = "chamrook";
                break;
            case 3:
                this.piece.img = "chamqueen";
        }
    }
}
function FlyingCat(x, y, color){
    pieces.push(this);
    this.piece = new Piece(x, y, color);
    this.piece.img = "flyingcat";
    this.piece.name = "Flying Cat";
    this.piece.desc = "Moves 3 squares forward, forward diagonal, and sideways. Only moves 1 square backwards and backwards diagonally.";
    this.piece.moves = (board) => {
        var dir = this.piece.color=="w"?-1:1;
        return step([[3, 3*dir], [-3, 3*dir], [0, 3*dir], [-3, 0], [3, 0], [-1, -dir], [0, -dir], [1, -dir]], this, board);
    }
}
function Rook(x, y, color){
    pieces.push(this);
    this.piece = new Piece(x, y, color);
    this.piece.img = "rook";
    this.piece.name = "Rook";
    this.piece.desc = "Just like in normal chess.";
    this.piece.moves = (board) => {
        return ride([[0, 1], [0, -1], [1, 0], [-1, 0]], this, board);
    }
}
function Huygens(x, y, color){
    pieces.push(this);
    this.piece = new Piece(x, y, color);
    this.piece.img = "huygens";
    this.piece.name = "Huygens";
    this.piece.desc = "Jumps in a rook's direction, but can only go a prime number of squares.";
    this.isPrime = (n) => {
        if(n <= 1){
            return false;
        }
        for(let i = 2; i <= n / 2; i++){
            if(n % i == 0){
                return false;
            }
        }
        return true;
    }
    this.piece.moves = (board) => {
        valid = [];
        var arr = [[0, 1], [0, -1], [1, 0], [-1, 0]];

        for(i of arr){
            var numSteps = 0;
            var co = [this.piece.x, this.piece.y];
            var stopped = false;

            while(!stopped){
                co[0] += i[0];
                co[1] += i[1];
                numSteps++;
                if(this.isPrime(numSteps)){
                    if(board.get(...co) != undefined){
                        if(board.get(...co).piece == undefined || board.get(...co).piece.color != this.piece.color){
                            valid.push([co[0], co[1], (move)=>{
                                board.board[this.piece.y][this.piece.x] = 0;
                                this.piece.x = move[0];
                                this.piece.y = move[1];
                                board.board[this.piece.y][this.piece.x] = this;
                            }])
                        }
                    }

                    if(board.get(...co) == undefined){
                        stopped = true;
                    }
                }
            }

        }

        return valid;
    }
}
function Wazir(x, y, color){
    pieces.push(this);
    this.piece = new Piece(x, y, color);
    this.piece.img = "wazir";
    this.piece.name = "Wazir";
    this.piece.desc = "Moves 1 square in any orthogonal direction.";
    this.piece.moves = (board) => {
        return step([[0, 1], [0, -1], [1, 0], [-1, 0]], this, board);
    }
}
function Knight(x, y, color){
    pieces.push(this);
    this.piece = new Piece(x, y, color);
    this.piece.img = "knight";
    this.piece.name = "Knight";
    this.piece.desc = "Just like in normal chess."
    this.piece.moves = (board) => {
        return step([[2, 1], [2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2], [-2, 1], [-2, -1]], this, board);
    }
}
function Elk(x, y, color){
    pieces.push(this);
    this.piece = new Piece(x, y, color);
    this.piece.img = "elk";
    this.piece.name = "Elk";
    this.piece.desc = "Moves to spaces in the perimeter of the 5x5 square around it."
    this.piece.moves = (board) => {
        return step([[2, 1], [2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2], [-2, 1], [-2, -1], [2, 0], [-2, 0], [0, -2], [0, 2], [2,2], [-2, 2], [-2, -2], [2, -2]], this, board);
    }
}
function NightRider(x, y, color){
    pieces.push(this);
    this.piece = new Piece(x, y, color);
    this.piece.img = "nightrider";
    this.piece.name = "Nightrider";
    this.piece.desc = "Moves like a knight, but can repeat the same move infinitely many times.";
    this.piece.moves = (board) => {
        return ride([[2, 1], [2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2], [-2, 1], [-2, -1]], this, board);
    }
}
function King(x, y, color){
    pieces.push(this);
    this.piece = new Piece(x, y, color);
    this.piece.img = "king";
    this.piece.name = "King";
    this.piece.desc = "Just like in normal chess."
    this.piece.moves = (board) => {
        return step([[0, 1], [0, -1], [1, 0], [-1, 0], [-1, 1], [-1, -1], [1, 1], [1, -1]], this, board);
    }
}
function Queen(x, y, color){
    pieces.push(this);
    this.piece = new Piece(x, y, color);
    this.piece.img = "queen";
    this.piece.name = "Queen";
    this.piece.desc = "Just like in normal chess.";
    this.piece.moves = (board) => {
        return ride([[0, 1], [0, -1], [1, 0], [-1, 0], [-1, 1], [-1, -1], [1, 1], [1, -1]], this, board);
    }
}
function Root50Leaper(x, y, color){
    pieces.push(this);
    this.piece = new Piece(x, y, color);
    this.piece.img = "root50leaper";
    this.piece.name = "Root 50 Leaper";
    this.piece.desc = "Jumps sqrt(50) units in any direction that results in it being on a square.";
    this.piece.moves = (board) => {
        return step([[7, 1], [7, -1], [-7, 1], [-7, -1], [1, 7], [1,-7], [-1, 7], [-1,-7], [5,5], [5,-5], [-5,-5], [-5,5]], this, board);
    }
}
function Cannon(x, y, color){
    pieces.push(this);
    this.piece = new Piece(x, y, color);
    this.piece.img = "cannon";
    this.piece.desc = "Shoots cannonballs forwards.";
    this.piece.name = "Cannon";
    this.piece.moves = (board) => {
        var valid = [];
        var dir = this.piece.color == "w"?-1:1;

        if(board.get(this.piece.x, this.piece.y + dir) == 0){
            valid.push([this.piece.x, this.piece.y + dir, (move)=>{
                var ball = new Cannonball(move[0], move[1], this.piece.color);
                ball.piece.justFired = true;
                board.board[move[1]][move[0]] = ball;
            }]);
        }

        return valid;
    }
}
function Cannonball(x, y, color){
    pieces.push(this);
    this.piece = new Piece(x, y, color);
    this.piece.img = "cannonball";
    this.piece.desc = "Moves forward 1 square at the beginning of your turn. When it collides with your piece, it dies, but if it collides with an opponent's, both die.";
    this.piece.name = "Cannonball"
    this.piece.time = 0;
    this.piece.moveUpdate = (board) => {
        this.piece.time++;
        this.piece.justFired = false;
        if(!this.piece.justFired){
            var dir = this.piece.color == "w"?-1:1;

            if(board.get(this.piece.x, this.piece.y + dir) == 0){
                board.board[this.piece.y][this.piece.x] = 0;
                this.piece.y += dir;
                board.board[this.piece.y][this.piece.x] = this;
            } else if(board.get(this.piece.x, this.piece.y + dir) == undefined){
                board.board[this.piece.y][this.piece.x] = 0;
                piecesToRemove.push(this);
            } else if(board.get(this.piece.x, this.piece.y + dir).piece.color != this.piece.color){
                board.board[this.piece.y][this.piece.x] = 0;
                board.board[this.piece.y + dir][this.piece.x] = 0;
                piecesToRemove.push(this);
            } else if(board.get(this.piece.x, this.piece.y + dir).piece.color == this.piece.color){
                board.board[this.piece.y][this.piece.x] = 0;
                piecesToRemove.push(this);
            }
        } else {
            this.piece.justFired = false;
        }
    }
}

function ride(arr, piece, board){
    valid = [];

    for(i of arr){
        var co = [piece.piece.x, piece.piece.y];
        var stopped = false;

        while(!stopped){
            co[0] += i[0];
            co[1] += i[1];
            if(board.get(...co) != undefined){
                if(board.get(...co).piece == undefined || board.get(...co).piece.color != piece.piece.color){
                    valid.push([co[0], co[1], (move)=>{
                        board.board[piece.piece.y][piece.piece.x] = 0;
                        piece.piece.x = move[0];
                        piece.piece.y = move[1];
                        board.board[piece.piece.y][piece.piece.x] = piece;
                    }])
                }
            }

            if(board.get(...co) != 0){
                stopped = true;
            }
        }

    }

    return valid;
}

function step(arr, piece, board){
    valid = [];

    for(i of arr){
        var co = [piece.piece.x, piece.piece.y];

        co[0] += i[0];
        co[1] += i[1];
        if(board.get(...co) != undefined){
            if(board.get(...co).piece == undefined || board.get(...co).piece.color != piece.piece.color){
                valid.push([co[0], co[1], (move)=>{
                    board.board[piece.piece.y][piece.piece.x] = 0;
                    piece.piece.x = move[0];
                    piece.piece.y = move[1];
                    board.board[piece.piece.y][piece.piece.x] = piece;
                }])
            }
        }
    }
    return valid;
}

//without King
var types = [
    Pawn,
    Bishop,
    Knight,
    Rook,
    Queen,
    NightRider,
    Alfil,
    Elk,
    Ferz,
    Wazir,
    FlyingCat,
    Bishight,
    Chameleon,
    Cannon,
    WizardStork,
    Waffle,
    Root50Leaper,
    Alfilrider,
    Huygens
];

var typesWKing = [];

for(let i of types){
    typesWKing.push(i);
}

typesWKing.push(King);