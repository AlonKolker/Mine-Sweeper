"use strict";

const MINE = "💣";
const FLAG = "🚩";

var gBoard;
var gLevel = {
  SIZE: 4,
  MINES: 2,
};

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
};

function init() {
  gBoard = buildBoard();
  // console.log(gBoard);
  renderBoard(gBoard);
}

function buildBoard() {
  var board = [];
  //Build the modal
  for (var i = 0; i < gLevel.SIZE; i++) {
    board.push([]);
    for (var j = 0; j < gLevel.SIZE; j++) {
      var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      };

      board[i][j] = cell;
    }
  }

  board = addMines(board);

  board = setMinesNegsCount(board);

  // console.table(board);

  return board;
}

function addMines(board) {
  var iDx = null;
  var jDx = null;
  var lastI = null;
  var lastJ = null;

  for (var i = 0; i < gLevel.MINES; i++) {
    iDx = getRandomIntInclusive(0, gLevel.SIZE - 1);
    jDx = getRandomIntInclusive(0, gLevel.SIZE - 1);

    //MODEL,makeing sure that will be 2 MINES
    while (iDx === lastI && jDx === lastJ) {
      iDx = getRandomIntInclusive(0, gLevel.SIZE - 1);
      jDx = getRandomIntInclusive(0, gLevel.SIZE - 1);
    }
    board[iDx][jDx].isMine = true;
    lastI = iDx;
    lastJ = jDx;
  }

  return board;
}

function setMinesNegsCount(board) {
  var numOfNeigMines = null;

  for (var i = 0; i < gLevel.SIZE; i++) {
    for (var j = 0; j < gLevel.SIZE; j++) {
      numOfNeigMines = countNeighbors(i, j, board);
      board[i][j].minesAroundCount = numOfNeigMines;
    }
  }

  return board;
}

function countNeighbors(cellI, cellJ, board) {
  var neighborsCount = 0;
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= gLevel.SIZE) continue;

    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j >= gLevel.SIZE) continue;
      if (board[i][j].isMine) neighborsCount++;
    }
  }
  // console.log(board);

  return neighborsCount;
}

///Verify what cell was clicked--> change to mine, flag or num
function ellClicked(elCurrent, event, iDx, jDx) {
  var currCell = gBoard[iDx][jDx];

  if (event.button === 0) {
    if (currCell.isMine) {
      elCurrent.innerText = MINE;
      elCurrent.isShown = true;
    }
    if (!currCell.isMine) {
      elCurrent.innerText = currCell.minesAroundCount;
    }
  }

  // el.innerText = FLAG

  if (currCell.minesAroundCount === 0 && currCell.isMine === false)
    expandShown(gBoard, elCurrent, iDx, jDx);
}

function expandShown(board, el, cellI, cellJ) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= gLevel.SIZE) continue;

    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j >= gLevel.SIZE) continue;

      //model
      board[i][j].isShown = true;

      //dom
      var elCurrNeig = document.querySelector(`#cell-${i}-${j}`);

      elCurrNeig.innerText = board[i][j].minesAroundCount; //dom
    }
  }
}

function cellMarked(event, el, iDx, jDx) {
  
  event.preventDefault();

  var currCell = gBoard[iDx][jDx];
  var currElement = el;

  if (currCell.isMarked) {
    //dom
    currCell.isMarked = false;
    //model
    currElement.innerText = " ";
    return;
  } else {
    //model
    currCell.isMarked = true;
    //dom
    currElement.innerText = FLAG;
  }
}
