"use strict";

const MINE = "💣";
const FLAG = "🚩";
const HAPPY = "😛";
const SAD = "😩";

var gMoves = [];
var gBoard;
var gInitTime;
var timeInterval;
var gHint = false;
var gHints = 3
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

/////////////////////////////////////////////////////////////////////////////
function init() {
  gGame.isOn = true;
  gBoard = buildBoard();
  renderBoard(gBoard);
  gameState();
}

/////////////////////////////////////////////////////////////////////////////
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

  return board;
}


//update the bored with MInes in random loc
function addMines(board, idxClicked, idjClicked) {
  var iDx = null;
  var jDx = null;
  // var lastI = null;
  // var lastJ = null;

  for (var i = 0; i < gLevel.MINES; i++) {
    iDx = getRandomIntInclusive(0, gLevel.SIZE - 1);
    jDx = getRandomIntInclusive(0, gLevel.SIZE - 1);
if(gBoard[iDx][jDx].isMine || iDx===idxClicked && jDx===idjClicked){
  i--
  continue
}
board[iDx][jDx].isMine = true;
    //MODEL,makeing sure that there is diffrent MINES INDEX
    // while (
    //   iDx === lastI &&
    //   (jDx === lastJ || iDx === idxClicked && jDx === idjClicked)
    // ) {
    //   iDx = getRandomIntInclusive(0, gLevel.SIZE - 1);
    //   jDx = getRandomIntInclusive(0, gLevel.SIZE - 1);
    // }
    // board[iDx][jDx].isMine = true;
    // // lastI = iDx;
    // lastJ = jDx;
  }

  return board;
}

//COUNT Mines in evry each cells - SENDING INDEX TO NEIG LOOP
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


//COUNT MINES WITH NEIG LOOP
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

  return neighborsCount;
}


///Verify what cell was clicked--> change to mine, flag or num./just left click
function ellClicked(elCurrent, event, iDx, jDx) {
  
  if (!gGame.isOn) return;
  
  //IF USER ASK HINT
  if (gHint) {
    tipQuickShow(gBoard, event, iDx, jDx);
    return;
  }

  ////INITIAL TIMER,ADD MINES
  if (gFirstClick) stepFirstClick(iDx, jDx);

  var currCell = gBoard[iDx][jDx];
  if (currCell.isMarked || currCell.isShown) return; //If flag - case of a flag and left click over him

  //If left click
  if (event.button === 0) {
    if (currCell.isMine) {
      elCurrent.innerText = MINE; //DOM
      currCell.isShown = true; //MODEL
      gGame.shownCount++;
      elCurrent.style.backgroundColor = "#EA5455";
      gameState();

      checkIfTherelife(iDx, jDx);
    }

    if (!currCell.isMine) {
      currCell.isShown = true; //MODEL
      elCurrent.innerText = currCell.minesAroundCount; //DOM
      gGame.shownCount++;
      gameState();
      checkIfTherelife(iDx, jDx);
    }
  }

  if (currCell.minesAroundCount === 0 && !currCell.isMine)
    expandShown(gBoard, elCurrent, iDx, jDx);
  if (!currCell.isMine) elCurrent.style.backgroundColor = "#A0BCC2";
}

/////////////////////////////////////////////////////////////////////////////
function checkIfTherelife(iDx, jDx) {
  
  //Because there is more lives then MINES
  if (gLevel.SIZE === 4) {
    if (
      (gGame.shownCount + gGame.markedCount === gGame.SIZE ** 2 &&
        gGame.markedCount === gLevel.MINES) ||
      gGame.shownCount === gLevel.SIZE ** 2
    )
      gameOver();
  }

  // if not MINE, DONE care
  if (!gBoard[iDx][jDx].isMine) return;
 
  gGame.lives--;
  var num = gGame.lives + 1;
  var currLive = "live" + num;

  //IN CASE WE HIT MORE MINES THEN LIVES
  if (gGame.lives === -1) {
    gameOver();
    return;
  }
  //Change the visibily of LIVES icons
  var elLive = document.querySelector(`.${currLive}`);
  elLive.style.opacity = "0.5";
}

/////////////////////////////////////////////////////////////////////////////
//INITIAL TIMER,ADD MINES
function stepFirstClick(iDx, jDx) {
  gInitTime = Date.now();
  timeInterval = setInterval(myTimer, 150);
  gBoard = addMines(gBoard, iDx, jDx);
  gBoard = setMinesNegsCount(gBoard);
  gFirstClick = false;
}

////////////////////////////////////////////////////////////////////////////
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
      if (!currCell.isMine) elCurrNeig.style.backgroundColor = "#A0BCC2";
      if (currCell.minesAroundCount === 0) expandShown(board, el, i, j);
      // saveMoves( iDx, jDx)
    }
  }
}

//////////////////////////////////////////////////////////////////////////////

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
var gHints=3
//////////////////////////////////////////////////////////////////////////////
function hints(el) {
  if (gFirstClick) return;
  if(gHints === 0)return

  el.removeAttribute("onClick")
  gHints--
  gHint = true;
  el.style.opacity = "0.3";
}

//THIS FUNCTION REVEALD THE CLICKED CELL AND THE 1No nighbors for x SEC
function tipQuickShow(board, el, cellI, cellJ) {
  var showTime = 300;

  //regular span function
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= gLevel.SIZE) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      var currCell = board[i][j];
      if (i === cellI && j === cellJ) continue;
      if (j < 0 || j >= gLevel.SIZE) continue;
      //model
      if (board[i][j].isMarked || currCell.isShown) continue; //If flag

      //DOM - reaveled the cells
      var elCurrNeig = document.querySelector(`#cell-${i}-${j}`); //Element by id
      elCurrNeig.innerText = currCell.minesAroundCount; //dom
      if (currCell.isMine) elCurrNeig.innerText = MINE;
      elCurrNeig.style.backgroundColor = "yellow";
    }
  }

  //Take care the clickd index
  var elClicked = document.querySelector(`#cell-${cellI}-${cellJ}`);
  elClicked.innerText = gBoard[cellI][cellJ].minesAroundCount;
  elClicked.style.backgroundColor = "yellow";

  setTimeout(() => {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
      if (i < 0 || i >= gLevel.SIZE) continue;

      for (var j = cellJ - 1; j <= cellJ + 1; j++) {
        var currCell = board[i][j];
        if (i === cellI && j === cellJ) continue;
        if (j < 0 || j >= gLevel.SIZE) continue;
        //model
        if (board[i][j].isMarked || currCell.isShown) continue; //If flag

        //DOM - Clean the cell
        var elCurrNeig = document.querySelector(`#cell-${i}-${j}`); //Element by id
        elCurrNeig.innerText = ""; //dom
        elCurrNeig.classList.add(".cell");
        elCurrNeig.style.backgroundColor = "";
      }
      //DOM - Clean the clicked cell
      elClicked.innerText = "";
      elClicked.classList.add(".cell");
      elClicked.style.backgroundColor = "";
    }
  }, showTime);

  gHint = false;
}

/////////////////////////////////////////////////////////////////////////////
function gameOver() {
  if (gGame.markedCount === gLevel.SIZE ** 2) return;
  console.log("test");
  clearInterval(timeInterval);
  gGame.isOn = false;

  var elRestart = document.querySelector(".restart");
  var elPopup = document.querySelector(".popup");

  //mark&reavels all the mile
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      if (gBoard[i][j].isMine) {
        var elCurrent = document.querySelector(`#cell-${i}-${j}`);
        elCurrent.innerText = MINE;
        // elCurrent.style.backgroundColor = "#EA5455";
        elCurrent.classList.add(".mine-reveald");
      }
    }
  }
  if (
    gGame.shownCount + gGame.markedCount === gLevel.SIZE ** 2 ||
    gGame.shownCount === gGame.SIZE ** 2
  ) {
    elRestart.innerText = HAPPY + "YOU WON!!";
    elPopup.innerText = "Winner!";
    elPopup.style.display = "block";
  } else {
    elRestart.innerText = SAD + "Try again!";
    elPopup.style.display = "block";
    elPopup.innerText = "Game Over!";
    return;
  }
}

/////////////////////////////////////////////////////////////////////////////

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
  var elHint0 = document.querySelector(".hint0");
  var elHint1 = document.querySelector(".hint1");
  var elHint2 = document.querySelector(".hint2");
   
  var Eltip0 = document.querySelector('.hint0')
  var Eltip1 = document.querySelector('.hint1')
  var Eltip2 = document.querySelector('.hint2')

  Eltip0.setAttribute("onclick", "hints(this)")
  Eltip1.setAttribute("onclick", "hints(this)")
  Eltip2.setAttribute("onclick", "hints(this)")


  elH2.innerText = `Timer: 0:0:0`;
  elRestart.innerText = HAPPY + "Lets play!";
  elIsShow.innerText = "Revealed: " + gGame.shownCount;
  isMarked.innerText = "Flags: " + gGame.markedCount;

  elLive1.style.opacity = "1";
  elLive2.style.opacity = "1";
  elLive3.style.opacity = "1";
  elPopup.style.display = "none";

  elHint0.style.opacity = "1";
  elHint1.style.opacity = "1";
  elHint2.style.opacity = "1";

  gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3,
  };
  gHints = 3
  gGame.isOn = false;
  gFirstClick = true;
  init();
}
