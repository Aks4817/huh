var c = document.createElement("canvas");
var start = 0;
var players = 1;
var personal_color='';
Gamerunning=0;
starto();
function starto() {
  if (start == 0) {
    document.getElementById("code").innerText = getRandomInt(10000, 99999);
  } else if (start == 1) {
    document.getElementById("joining_code").style.display = "none";

    document.getElementById("Join Room").style.display = "none";
    document.getElementById("Start Room").style.display = "none";
    document.getElementById("play with random").style.display = "none";
  } else {
  }
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


document.body.appendChild(c);

var scale = 2.0;

c.width = scale * window.innerHeight;
c.height = scale * window.innerHeight;

var offLeft = (window.innerWidth - window.innerHeight) / 2;

var ctx = c.getContext("2d");
var pieceSelected;
var validMoves;

oncontextmenu = (e) => {
  e.preventDefault();
};

// document.getElementById("chatMsg").onkeydown = (e) => {
//     if(e.key == "Enter"){
//         sendMessage();
//     }
// }

onmouseup = (e) => {
  e.preventDefault();
  var mx = ~~(
    (Math.max(chessBoard.board.length, chessBoard.board[0].length) *
      e.clientX *
      scale) /
    c.height
  );
  var my = ~~(
    (Math.max(chessBoard.board.length, chessBoard.board[0].length) *
      e.clientY *
      scale) /
    c.height
  );
  if (chessBoard.flipped) {
    my = chessBoard.board.length - 1 - my;
  }
  try {
    ws.send(JSON.stringify({ mx, my, button: e.button, type: "click" }));
  } catch {}

  handleClick(mx, my, e.button);
};

document
  .getElementById("play with random")
  .addEventListener("mousedown", () => {
    console.log("hurray");
    start = 1;
    starto();
    ws.send(
      JSON.stringify({
        type: "init_game",
        mode: document.getElementById("modeSelect").selectedIndex,
        room: document.getElementById("code").innerText,
        state:encodeState()
      })
    );
  });
document
  .getElementById("Join Room")
  .addEventListener("mousedown", () => {
    console.log("hurray");
    if (document.getElementById("roomreq").value === "") {
      document.getElementById("err").textContent = "Enter a valid room id";
    } else {
      start = 1;
      starto();
      ws.send(
        JSON.stringify({
          type: "Join Room",
          mode: document.getElementById("modeSelect").selectedIndex,
          room: document.getElementById("roomreq").value,
            state:encodeState()
        })
      );
    }
  });
  document
  .getElementById("Start Room")
  .addEventListener("mousedown", () => {
    console.log("hurray");
   
      start = 1;
      starto();
      ws.send(
        JSON.stringify({
          type: "Start Room",
          mode: document.getElementById("modeSelect").selectedIndex,
          room: document.getElementById("code").innerText,
            state:encodeState()
        })
      );
    
  });
  var chessBoard;

  var ws;
  
  function initSocket() {
    ws = new WebSocket(`wss://huh-4ynz.onrender.com`);
    
    ws.onopen = (e) => {
      // ws.send(JSON.stringify({type: "init_game"}));
      loadModes();
    };
    
    ws.onmessage = (e) => {
      try {
        // console.log(e);
        var data = JSON.parse(e.data);
        
        if (data.type == "update") {
          ws.send(JSON.stringify({ state: encodeState(), type: "updateData" }));
          // ws.send(JSON.stringify({ type: "turnUpdate", turns: turns }));
        }
        if (data.type == "Wrong Room") {
          document.getElementById("err").textContent = "Enter a valid room id";
          
        }
        if (data.type == "updateData") {
          loadState(data.state);
          if(document.getElementById("turn").innerText=="Your turn"){
            document.getElementById("turn").innerText="Opponent's turn"
          }else{
            document.getElementById("turn").innerText="Your turn"
            
        }
      }
      if (data.type == "turnUpdate") {
        turns = turns + 1;
      }
      if(data.type=="gameOver"){
        var winner=data.winner;
        document.getElementById("turn").innerText = `${winner} wins! ${winner=="white"?"white":"black"} king was captured`;

      }
      if (data.type == "init_game") {
        document.getElementById("color").innerText = data.payload.color;
        document.getElementById("code").innerText = data.payload.room;
        document.getElementsByClassName('modeboxTitle')[0].innerText="Multiplayer Mode"
        document.getElementById("modeSelect").selectedIndex=data.payload.mode;
        selectMode();
        // console.log(data.payload.state)
        loadState(data.payload.state)
        
        switch(data.payload.mode){
          case 0:
            document.getElementById('mode').innerText="Fairy Chess";
            break;
          case 1:
            document.getElementById('mode').innerText="Default";
            break;
          case 2:
            document.getElementById('mode').innerText="Random 8x8";
            break;
          case 3:
            document.getElementById('mode').innerText="Random 16x16";
            break;
          case 4:
            document.getElementById('mode').innerText="Elk Chess";
            break;
          case 5:
            document.getElementById('mode').innerText="Chameleon Chess";
            break;
          }
          document.getElementById('modeSelect').style.display="none";
        
        personal_color=data.payload.color;
        players=2;
        turns = data.payload.turns;
        if(turns==0 &&personal_color=="white"){
          document.getElementById("turn").innerText="Your turn"
        }else{
          document.getElementById("turn").innerText="Opponent's turn"

        }
      }
      if (data.type == "selectedChange") {
        // document.getElementById("modeSelect").selectedIndex = data.selectedIndex;
        // ws.send(JSON.stringify({state: encodeState(), type:"update"}));
        // ws.send(JSON.stringify({type: "turnUpdate", turns: 0}));
      }
    } catch (exception) {
      console.log(exception);
    }
  };
  ws.onclose = (e) => {
    initSocket();
  };
  // if(!int){
  //     int = setInterval(()=>{
  //         try{
  //             ws.send(JSON.stringify({type: "heartbeat"}));
  //             if(ws.readyState == 3){
  //                 initSocket();
  //             }
  //         } catch {

  //         }
  //     }, 1000);
  // }
}

var int;

var turns = 0;

var moved = false;

function handleClick(mx, my, button) {

  console.log(turns);
  if (button == 0) {
    if (
      mx >= 0 &&
      mx < chessBoard.board[0].length &&
      my >= 0 &&
      my < chessBoard.board.length
    ) {
      if(Gamerunning===1){
        return;
      }
      if (!pieceSelected) {
        pieceSelected = chessBoard.get(mx, my);
        if (pieceSelected == 0) {
          pieceSelected = undefined;
        } else {
          validMoves = pieceSelected.piece.moves(chessBoard);
          chessBoard.drawMoves(validMoves);
          if (validMoves.length == 0) {
            pieceSelected = undefined;
          }
        }
      } else {
        if (validMoves.length > 0) {
          for (i of validMoves) {
            if (
              i[0] == mx &&
              i[1] == my &&
              ((players == 1 &&
              ((turns % 2 == 0 && pieceSelected.piece.color == "w") ||
                (turns % 2 == 1 && pieceSelected.piece.color == "b")))||( players==2 && ((turns % 2 == 0 && pieceSelected.piece.color == "w" && personal_color=="white") ||
                (turns % 2 == 1 && pieceSelected.piece.color == "b" && personal_color=="black")) )
            )) {
              turns++;
              moved = true;
              i[2](i);
              for (let j of pieces) {
                if (chessBoard.get(j.piece.x, j.piece.y) == j) {
                  j.piece.update(chessBoard);
                  if (turns % 2 == 1 && j.piece.color == "b") {
                    j.piece.moveUpdate(chessBoard);
                  } else if (turns % 2 == 0 && j.piece.color == "w") {
                    j.piece.moveUpdate(chessBoard);
                  }
                }
              }
              for (let j of piecesToRemove) {
                pieces.splice(pieces.indexOf(j), 1);
              }
              piecesToRemove = [];
            }
          }
        }
        pieceSelected = undefined;
        if(moved){
          ws.send(JSON.stringify({ type: "update", state: encodeState() }));
          const gameOverStatus = isGameOver();
          if (gameOverStatus === 1) {
            Gamerunning=0;
            document.getElementById("turn").innerText = "Black wins! White king was captured.";
            ws.send(JSON.stringify({
              type:"gameOver",
              winner:"Black"
            }))

          } else if (gameOverStatus === 2) {
            Gamerunning=0;
            document.getElementById("turn").innerText = "White wins! Black king was captured.";
            ws.send(JSON.stringify({
              type:"gameOver",
              winner:"White"
            }))
          } else {
            if(document.getElementById("turn").innerText=="Your turn"){
              document.getElementById("turn").innerText="Opponent's turn"
            }else{
              document.getElementById("turn").innerText="Your turn"
            }
          }
        }
        chessBoard.draw();
      }
    }

    if (chessBoard.get(mx, my)) {
      updateTip(chessBoard.get(mx, my));
    }
  }
}



function Board(xSize, ySize) {
  this.board = [];
  this.lastBoard = [];
  this.boardBefore = [];
  this.flipped = false;

  for (let i = 0; i < ySize; i++) {
    this.board.push([]);
    for (let j = 0; j < xSize; j++) {
      this.board[i].push(0);
    }
  }

  this.render;

  this.draw = () => {
    while (this.lastBoard.length < this.board.length) {
      this.lastBoard.push([]);
    }
    while (this.boardBefore.length < this.board.length) {
      this.boardBefore.push([]);
    }
    if (this.render) {
      ctx.drawImage(this.render, 0, 0);
      var maxSize = Math.max(this.board.length, this.board[0].length);
      for (let i = 0; i < this.board.length; i++) {
        for (let j = 0; j < this.board[i].length; j++) {
          if (
            this.lastBoard[i][j] != this.board[i][j] ||
            (this.board[i][j].piece && this.board[i][j].piece.drawQueue)
          ) {
            ctx.fillStyle =
              (i + j) % 2 == 0 ? "rgb(200,200,200)" : "rgb(151,151,151)";
            ctx.fillRect(
              ...gCoords(
                j,
                this.flipped ? this.board.length - 1 - i : i,
                this.board
              ),
              c.height / maxSize,
              c.height / maxSize
            );
            if (this.board[i][j] != 0) {
              this.board[i][j].piece.drawQueue = false;
              if (this.board[i][j].piece.color == "b") ctx.filter = "invert(1)";
              ctx.drawImage(
                tPics[this.board[i][j].piece.img],
                ...gCoords(
                  j,
                  this.flipped ? this.board.length - 1 - i : i,
                  this.board
                )
              );
              ctx.filter = "invert(0)";
            }
          }

          if (moved) {
            this.boardBefore[i][j] = this.lastBoard[i][j];
          }
          this.lastBoard[i][j] = this.board[i][j];
        }
      }
      moved = false;
      this.render.getContext("2d").drawImage(c, 0, 0);
    } else {
      ctx.clearRect(0, 0, c.width, c.height);
      var maxSize = Math.max(this.board.length, this.board[0].length);
      for (let i = 0; i < this.board.length; i++) {
        for (let j = 0; j < this.board[i].length; j++) {
          ctx.fillStyle =
            (i + j) % 2 == 0 ? "rgb(200,200,200)" : "rgb(151,151,151)";
          ctx.fillRect(
            ...gCoords(
              j,
              this.flipped ? this.board.length - 1 - i : i,
              this.board
            ),
            c.height / maxSize,
            c.height / maxSize
          );
        }
      }

      this.render = document.createElement("canvas");
      this.render.width = c.width;
      this.render.height = c.height;
      this.render.getContext("2d").drawImage(c, 0, 0);
      this.draw();
    }
  };

  this.drawMoves = (moves) => {
    if ((players == 1 &&
      ((turns % 2 == 0 && pieceSelected.piece.color == "w") ||
        (turns % 2 == 1 && pieceSelected.piece.color == "b")))||(players==2 &&((turns % 2 == 0 && pieceSelected.piece.color == "w" &&personal_color=="white") ||
        (turns % 2 == 1 && pieceSelected.piece.color == "b" && personal_color=="black")) )
    ) {
      ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
    } else {
      ctx.fillStyle = "rgba(0, 255, 255, 0.2)";
    }
    ctx.beginPath();
    for (i of moves) {
      ctx.rect(
        ...gCoords(
          i[0],
          this.flipped ? this.board.length - 1 - i[1] : i[1],
          this.board
        ),
        c.height / Math.max(this.board.length, this.board[0].length),
        c.height / Math.max(this.board.length, this.board[0].length)
      );
    }
    ctx.fill();
    ctx.closePath();
  };

  this.get = (x, y) => {
    if (y >= 0 && y < this.board.length && x >= 0 && x < this.board[0].length) {
      return this.board[y][x];
    } else {
      return undefined;
    }
  };
  this.getLast = (x, y) => {
    if (
      y >= 0 &&
      y < this.boardBefore.length &&
      x >= 0 &&
      x < this.boardBefore[0].length
    ) {
      return this.boardBefore[y][x];
    } else {
      return undefined;
    }
  };
}

function gCoords(x, y, board) {
  maxSize = Math.max(board.length, board[0].length);
  return [(c.height * x) / maxSize, (c.height * y) / maxSize];
}

/*pictures["rook"].onload = () => {
    chessBoard.render = undefined;
    chessBoard.lastBoard = [];
    chessBoard.draw();
}*/

function loadBoard(b) {
  pieces = [];
  //turns = 0;
  for (i of picNames) {
    var canv = document.createElement("canvas");
    canv.width = c.height / Math.max(b.length, b[0].length);
    canv.height = c.height / Math.max(b.length, b[0].length);
    canv
      .getContext("2d")
      .drawImage(
        pictures[i],
        0,
        0,
        c.height / Math.max(b.length, b[0].length),
        c.height / Math.max(b.length, b[0].length)
      );
    tPics[i] = canv;
  }
  var b2 = [];
  for (let i = 0; i < b.length; i++) {
    b2.push([]);
    for (let j = 0; j < b[0].length; j++) {
      b2[i][j] = 0;
      if (b[i][j] != 0) {
        b2[i][j] = new b[i][j][0](j, i, b[i][j][1]);
      }
    }
  }
  chessBoard.board = b2;
  chessBoard.render = undefined;
  chessBoard.draw();
}

function isGameOver() {
  let whiteKingPresent = false;
  let blackKingPresent = false;
  
  // Traverse the board to find both kings
  for (let i = 0; i < chessBoard.board.length; i++) {
    for (let j = 0; j < chessBoard.board[i].length; j++) {
      const piece = chessBoard.board[i][j];
      if (piece && piece.piece.name === 'King') {
        if (piece.piece.color === 'w') {
          whiteKingPresent = true;
        } else if (piece.piece.color === 'b') {
          blackKingPresent = true;
        }
      }
    }
  }

  if (!whiteKingPresent) {
    return 1; // White king is not on the board
  } else if (!blackKingPresent) {
    return 2; // Black king is not on the board
  } else {
    return 0; // Both kings are on the board
  }
}


function encodeState() {
  var state = [];
  for (let i = 0; i < chessBoard.board.length; i++) {
    state.push([]);
    for (let j = 0; j < chessBoard.board[0].length; j++) {
      state[i][j] = [
        chessBoard.board[i][j] == 0
          ? -1
          : typesWKing.indexOf(chessBoard.board[i][j].constructor),
        chessBoard.board[i][j] == 0 ? -1 : chessBoard.board[i][j].piece.color,
        chessBoard.board[i][j] == 0 ? -1 : chessBoard.board[i][j].piece.state,
      ];
    }
  }

  return state;
}

function loadState(state) {
  var board = [];
  for (let i = 0; i < state.length; i++) {
    board.push([]);
    for (let j = 0; j < state.length; j++) {
      if (state[i][j][0] == -1) {
        board[i][j] = 0;
      } else {
        board[i][j] = [typesWKing[state[i][j][0]], state[i][j][1]];
      }
    }
  }

  loadBoard(board);

  for (let i of pieces) {
    i.piece.state = state[i.piece.y][i.piece.x][2];
    i.piece.stateUp();
  }

  chessBoard.render = undefined;
  chessBoard.lastBoard = [];
  chessBoard.draw();
}

function updateTip(piece) {
  document.getElementById(
    "tipImg"
  ).src = `./assets/pieces/${piece.piece.img}.png`;
  document.getElementById("tipTitle").innerText = piece.piece.name;
  document.getElementById("tipP").innerText = piece.piece.desc;
}

function sendMessage() {
  var msg = document.getElementById("chatMsg");
  ws.send(JSON.stringify({ type: "message", msg: msg.value }));
  loadMessage(msg.value);
  msg.value = "";
}

function loadMessage(message) {
  var chatBox = document.getElementById("chatBox");
  chatBox.innerText += `${message}\n`;
  chatBox.scrollTop = chatBox.scrollHeight;
}

function flipBoard() {
  chessBoard.flipped = !chessBoard.flipped;
  chessBoard.draw();
}
