var gInitTime;
var timeInterval;

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function gameState() {
  var elIsShow = document.querySelector(".Is-show");
  var isMarked = document.querySelector("p.is-Marked");

  elIsShow.innerText = "Revealed: " + gGame.shownCount;
  isMarked.innerText = "Flags: " + gGame.markedCount;

  if (gGame.shownCount + gGame.markedCount === gLevel.SIZE ** 2) gameOver();
}

//MyTimer

function mYtimer() {
  var miliSec = Date.now() - gInitTime;
  var min = Math.floor(miliSec / 1000 / 60);
  var secAndMs = ((miliSec / 1000) % 60).toFixed(2);
  var newSec = secAndMs.replace(".", ":");

  var elH2 = document.querySelector(".timer");

  elH2.innerHTML = `Timer: ${min}:${newSec}`;
}

function changeSize(generalSize) {
  var reqSize;
  if (generalSize === 16) {
    reqSize = Math.sqrt(generalSize);
    gLevel.SIZE = Math.sqrt(generalSize);
    gLevel.MINES = 2;
  }

  if (generalSize === 36) {
    gLevel.SIZE = Math.sqrt(generalSize);
    gLevel.MINES = 4;
  }

  if (generalSize === 64) {
    gLevel.SIZE = Math.sqrt(generalSize);
    gLevel.MINES = 8;
  }
  restart();
}


//for farter use
// function saveMoves(i, j) {
//   gMoves = push[{ i: i, j: j }];
//   console.log(gMoves);
// }

// function undoMoves() {
//   var moveNum = gMoves.length;
//   console.log(gMoves);

//   var iDx = gMoves[moveNum-1].i;
//   var jDx = gMoves[moveNum-1].j;
 
//   if(gBored[iDx][jDx].isMarked) gBored[iDx][jDx].isMarked = false
//   if(gBored[iDx][jDx].isShown){
//    gBored[iDx][jDx].isShown = false
//   }
//   var lastClick = document.querySelector(`#cell-${iDx}-${jDx}`)
//   lastClick.style.backgroundColor = 'black'

// }
