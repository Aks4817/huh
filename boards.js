var defaultBoard = [
    [[Rook, "b"], [Knight, "b"], [Bishop, "b"], [Queen, "b"], [King, "b"], [Bishop, "b"], [Knight, "b"], [Rook, "b"]],
    [[Pawn, "b"], [Pawn, "b"], [Pawn, "b"], [Pawn, "b"], [Pawn, "b"], [Pawn, "b"], [Pawn, "b"], [Pawn, "b"]],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [[Pawn, "w"], [Pawn, "w"], [Pawn, "w"], [Pawn, "w"], [Pawn, "w"], [Pawn, "w"], [Pawn, "w"], [Pawn, "w"]],
    [[Rook, "w"], [Knight, "w"], [Bishop, "w"], [Queen, "w"], [King, "w"], [Bishop, "w"], [Knight, "w"], [Rook, "w"]],
];

var elkChess = [
    [[Elk, "b"], [Elk, "b"], [Elk, "b"], [Elk, "b"], [King, "b"], [Elk, "b"], [Elk, "b"], [Elk, "b"]],
    [[Elk, "b"], [Elk, "b"], [Elk, "b"], [Elk, "b"], [Elk, "b"], [Elk, "b"], [Elk, "b"], [Elk, "b"]],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [[Elk, "w"], [Elk, "w"], [Elk, "w"], [Elk, "w"], [Elk, "w"], [Elk, "w"], [Elk, "w"], [Elk, "w"]],
    [[Elk, "w"], [Elk, "w"], [Elk, "w"], [Elk, "w"], [King, "w"], [Elk, "w"], [Elk, "w"], [Elk, "w"]]
];

var coolBoard = [
    [[Rook, "b"], [Elk, "b"], [Chameleon, "b"], [WizardStork, "b"], [King, "b"], [Bishight, "b"], [NightRider, "b"], [Rook, "b"]],
    [[Pawn, "b"], [Pawn, "b"], [Pawn, "b"], [Pawn, "b"], [Pawn, "b"], [Pawn, "b"], [Pawn, "b"], [Pawn, "b"]],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [[Pawn, "w"], [Pawn, "w"], [Pawn, "w"], [Pawn, "w"], [Pawn, "w"], [Pawn, "w"], [Pawn, "w"], [Pawn, "w"]],
    [[Rook, "w"], [Elk, "w"], [Chameleon, "w"], [WizardStork, "w"], [King, "w"], [Bishight, "w"], [NightRider, "w"], [Rook, "w"]]
]

//testBoard -----------------------------------
var testBoard = [];

var rowW = [];
var rowB = [];

for(let i of typesWKing){
    rowW.push([i, "w"]);
    rowB.push([i, "b"]);
}
testBoard.push(rowB);
var zeroes = [];
while(zeroes.length < testBoard[0].length)
    zeroes.push(0);
while(testBoard.length < testBoard[0].length - 1){
    testBoard.push(zeroes.copyWithin());
}
testBoard.push(rowW);
//--------------------------------------------

function rand8(){
    var rowW = [];
    var rowB = [];
    var pawnW = [];
    var pawnB = [];

    for(let i = 0; i < 8; i++){
        var rand = types[~~(Math.random() * types.length)]
        var rand2 = types[~~(Math.random() * types.length)]
        rowW.push([rand, "w"]);
        rowB.push([rand, "b"]);
        pawnW.push([rand2, "w"]);
        pawnB.push([rand2, "b"]);
    }

    var rand2 = ~~(Math.random() * 8);
    rowW[rand2] = [King, "w"];
    rowB[rand2] = [King, "b"];

    return [
        rowB,
        pawnB,
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        pawnW,
        rowW
    ]
}

//----------------------------------------------------------------

function rand16(){
    var rowW = [];
    var rowB = [];
    var rowW2 = [];
    var rowB2 = [];
    var rowW3 = [];
    var rowB3 = [];
    var pawnW = [];
    var pawnB = [];

    for(let i = 0; i < 16; i++){
        var rand = types[~~(Math.random() * types.length)]
        var rand2 = types[~~(Math.random() * types.length)]
        var rand3 = types[~~(Math.random() * types.length)]
        rowW.push([rand, "w"]);
        rowB.push([rand, "b"]);
        rowW2.push([rand2, "w"]);
        rowB2.push([rand2, "b"]);
        rowW3.push([rand3, "w"]);
        rowB3.push([rand3, "b"]);
        pawnW.push([Pawn, "w"]);
        pawnB.push([Pawn, "b"]);
    }

    var rand2 = ~~(Math.random() * 16);
    rowW[rand2] = [King, "w"];
    rowB[rand2] = [King, "b"];

    return [
        rowB,
        rowB2,
        rowB3,
        pawnB,
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        pawnW,
        rowW3,
        rowW2,
        rowW
    ]
}
//-----------------------------------------------------------------
function chameleonChess(){
    var rowW = [];
    var rowB = [];
    var pawnW = [];
    var pawnB = [];

    for(let i = 0; i < 8; i++){
        rowW.push([Chameleon, "w"]);
        rowB.push([Chameleon, "b"]);
        pawnW.push([Pawn, "w"]);
        pawnB.push([Pawn, "b"]);
    }

    var rand2 = ~~(Math.random() * 8);
    rowW[4] = [King, "w"];
    rowB[4] = [King, "b"];

    var board = [
        rowB,
        pawnB,
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        pawnW,
        rowW
    ]

    loadBoard(board);
    for(let i = 0; i < chessBoard.board[0].length; i++){
        var rand = ~~(Math.random() * 4);
        chessBoard.board[0][i].piece.state = rand;
        chessBoard.board[7][i].piece.state = rand;
    }
    for(let i = 0; i < chessBoard.board[1].length; i++){
        var rand = ~~(Math.random() * 4);
        chessBoard.board[1][i].piece.state = rand;
        chessBoard.board[6][i].piece.state = rand;
    }

    for(let i of pieces){
        i.piece.moveUpdate();
    }
    chessBoard.render = undefined;
    chessBoard.lastBoard = [];
    chessBoard.draw();
}
//---------------------------------------

var modes = [
    ["Fairy Board", ()=>{loadBoard(coolBoard)}],
    ["Default", ()=>{loadBoard(defaultBoard)}],
    ["Random 8x8", ()=>{loadBoard(rand8())}],
    ["Random 16x16", ()=>{loadBoard(rand16())}],
    ["Elk Chess", ()=>{loadBoard(elkChess)}],
    ["Chameleon Chess", ()=>{chameleonChess()}]
];

var modesDict = {};
for(let i of modes){
    modesDict[i[0]] = i[1];
}

function loadModes(){
    var modeSelect = document.getElementById("modeSelect");
    modeSelect.innerHTML = "";

    for(let i of modes){
        modeSelect.innerHTML += `<option value="${i[0]}">${i[0]}</option>`;
    }

}

function selectMode(){
    turns = 0;
    modesDict[document.getElementById("modeSelect").value]();
    start=0;
    // starto();
    // ws.send(
    //     JSON.stringify({
    //       type: "init_game",
    //       mode: document.getElementById("modeSelect").selectedIndex,
    //       roomid: document.getElementById("roomreq").value,
    //     //   state:encodeState()
    //     })
    //   );
    // ws.send(JSON.stringify({state: encodeState(), type:"updateData"}));
    // ws.send(JSON.stringify({type: "turnUpdate", turns: turns}));
    // ws.send(JSON.stringify({type: "selectedChange",room: document.getElementById('code').innerText, selectedIndex: document.getElementById("modeSelect").selectedIndex}));
}