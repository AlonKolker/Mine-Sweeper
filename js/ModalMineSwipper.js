"use strict";

const MINE = "💣";
const FLAG = "🚩";
const HAPPY = "😛";
const SAD = "😩";
var gMoves = [];
var gBoard;

var gLevel = {
  SIZE: 4,
  MINES: 2,
};

var gGame = {
  isOn: true,
  shownCount: 0,
  markedCount: 0,
  secsPassed: 0,
  lives: 3,
};

var gFirstClick = true;

function init() {
  gGame.isOn = true;
  gBoard = buildBoard();
  // console.log(gBoard);
  renderBoard(gBoard);
  gameState();
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

  // board = addMines(board);
  // board = setMinesNegsCount(board);

  // console.table(board);

  return board;
}

//update the bored with MInes in random loc
function addMines(board, idxClicked, idjClicked) {
  var iDx = null;
  var jDx = null;
  var lastI = null;
  var lastJ = null;

  for (var i = 0; i < gLevel.MINES; i++) {
    iDx = getRandomIntInclusive(0, gLevel.SIZE - 1);
    jDx = getRandomIntInclusive(0, gLevel.SIZE - 1);

    //MODEL,makeing sure that will be 2 MINES
    while (
      iDx === lastI &&
      jDx === lastJ &&
      iDx === idxClicked &&
      jDx === idjClicked
    ) {
      iDx = getRandomIntInclusive(0, gLevel.SIZE - 1);
      jDx = getRandomIntInclusive(0, gLevel.SIZE - 1);
    }
    board[iDx][jDx].isMine = true;
    lastI = iDx;
    lastJ = jDx;
  }

  return board;
}

//Find Mines in evry each cells
function setMinesNegsCount(board) {
  var numOfNeigMines = null;

  for (var i = 0; i < gLevel.SIZE; i++) {
    for (var j = 0; j < gLevel.SIZE; j++) {
      numOfNeigMines = countMineNeighbors(i, j, board);
      board[i][j].minesAroundCount = numOfNeigMines;
    }
  }

  return board;
}

function countMineNeighbors(cellI, cellJ, board) {
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

///Verify what cell was clicked--> change to mine, flag or num./just left click
function ellClicked(elCurrent, event, iDx, jDx) {
  if (!gGame.isOn) return;

  if (gFirstClick) stepFirstClick(iDx, jDx);

  var currCell = gBoard[iDx][jDx];
  if (currCell.isMarked || currCell.isShown) return; //If flag - case of a flag and left click over him

  if (event.button === 0) {
    //If left click

    if (currCell.isMine) {
      elCurrent.innerText = MINE; //DOM
      currCell.isShown = true; //MODEL
      gGame.shownCount++;
      gameState();
      //  if(gGame.lives === 0){
      //      gameOver();
      //  }
      checkIfTherelife();
    }

    if (!currCell.isMine) {
      currCell.isShown = true; //MODEL
      elCurrent.innerText = currCell.minesAroundCount; //DOM
      gGame.shownCount++;
      gameState();
    }
  }

  if (currCell.minesAroundCount === 0 && !currCell.isMine)
    expandShown(gBoard, elCurrent, iDx, jDx);

  elCurrent.style.backgroundColor = "#A0BCC2";
}

function checkIfTherelife() {
  gGame.lives--;
  var num = gGame.lives + 1;
  var currLive = "live" + num;

  if (gGame.lives === 0) {
    gameOver();
  }

  var elLive = document.querySelector(`.${currLive}`);
  elLive.style.opacity = "0.5";
}

function stepFirstClick(iDx, jDx) {
  gInitTime = Date.now();
  timeInterval = setInterval(mYtimer, 150);
  gBoard = addMines(gBoard, iDx, jDx);
  gBoard = setMinesNegsCount(gBoard);
  gFirstClick = false;
}
function expandShown(board, el, cellI, cellJ) {
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= gLevel.SIZE) continue;

    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      var currCell = board[i][j];
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j >= gLevel.SIZE) continue;

      //model
      if (board[i][j].isMarked || currCell.isShown) continue; //If flag
      currCell.isShown = true;
      gGame.shownCount++;
      gameState();

      //dom
      var elCurrNeig = document.querySelector(`#cell-${i}-${j}`); //Element by id
      elCurrNeig.innerText = currCell.minesAroundCount; //dom
      elCurrNeig.style.backgroundColor = "#A0BCC2";
      // saveMoves( iDx, jDx)
    }
  }
}

//Mark on unmark with flag
function cellMarked(event, el, iDx, jDx) {
  event.preventDefault(); //Make right click possible
  if (!gGame.isOn) return;

  var currCell = gBoard[iDx][jDx];
  var currElement = el;

  if (currCell.isShown) return;

  if (currCell.isMarked) {
    //dom
    currCell.isMarked = false;
    //model
    currElement.innerText = " ";
    gGame.markedCount--;
    gameState();
    return;
  } else {
    //model
    currCell.isMarked = true;
    //dom
    currElement.innerText = FLAG;
    gGame.markedCount++;
    gameState();
  }
}

function gameOver() {
  clearInterval(timeInterval);
  gGame.isOn = false;

  var elRestart = document.querySelector(".restart");
  var elPopup = document.querySelector(".popup");

  console.log("gameover");
  if (gGame.shownCount + gGame.markedCount === gLevel.SIZE ** 2) {
    elRestart.innerText = HAPPY + "YOU WON!!";
  } else {
    elRestart.innerText = SAD + "Try again!";
  }

  elPopup.style.display = "block";
}

///reset all the gVars
function restart() {
  clearInterval(timeInterval);

  var elH2 = document.querySelector(".timer");
  var elRestart = document.querySelector(".restart");
  var elIsShow = document.querySelector(".Is-show");
  var isMarked = document.querySelector("p.is-Marked");
  var elLive1 = document.querySelector(".live1");
  var elLive2 = document.querySelector(".live2");
  var elLive3 = document.querySelector(".live3");
  var elPopup = document.querySelector(".popup");

  elH2.innerText = `Timer: 0:0:0`;
  elRestart.innerText = HAPPY + "Lets play again!";
  elIsShow.innerText = "Revealed: " + gGame.shownCount;
  isMarked.innerText = "Flags: " + gGame.markedCount;

  elLive1.style.opacity = "1";
  elLive2.style.opacity = "1";
  elLive3.style.opacity = "1";
  elPopup.style.display = "none";

  gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3,
  };
  gGame.isOn = false;
  gFirstClick = true;
  init();
}
