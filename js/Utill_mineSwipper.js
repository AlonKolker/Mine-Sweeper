
/////////////////////////////////////////////////////////////////////////////////////
function gameState() {
  var elIsShow = document.querySelector(".Is-show");
  var isMarked = document.querySelector("p.is-Marked");

  elIsShow.innerText = "Revealed: " + gGame.shownCount;
  isMarked.innerText = "Flags: " + gGame.markedCount;
}

/////////////////////////////////////////////MyTimermYtimer
function myTimer() {
  var miliSec = Date.now() - gInitTime;
  var min = Math.floor(miliSec / 1000 / 60);
  var secAndMs = ((miliSec / 1000) % 60).toFixed(2);
  var newSec = secAndMs.replace(".", ":");

  var elH2 = document.querySelector(".timer");

  elH2.innerHTML = `Timer: ${min}:${newSec}`;
}

///////////////////////////////////////////////////////////
function changeSize(generalSize) {
  var reqSize;
  if (generalSize === 16) {
    reqSize = Math.sqrt(generalSize);
    gLevel.SIZE = Math.sqrt(generalSize);
    gLevel.MINES = 2;
  }

  if (generalSize === 36) {
    gLevel.SIZE = Math.sqrt(generalSize);
    gLevel.MINES = 12;
  }

  if (generalSize === 64) {
    gLevel.SIZE = Math.sqrt(generalSize);
    gLevel.MINES = 30;
  }
  restart();
}

/////////////////////////////////////////////////////////////////////////////
function gameOver() {
  if (gGame.markedCount === gLevel.SIZE ** 2) return;

  gGame.isOn = false;
  clearInterval(timeInterval);

  var elRestart = document.querySelector(".restart");
  var elPopup = document.querySelector(".popup");

  //Mark&reavels all the MINES
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      if (gBoard[i][j].isMine) {
        var elCurrent = document.querySelector(`#cell-${i}-${j}`);
        elCurrent.innerText = MINE;
        elCurrent.classList.add(".mine-reveald");
      }
    }
  }

  ///GAME OVER OPTIONS
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
  gGame.isOn = false;
  gFirstClick = true;
  init();
}

////

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
///

//for FARTHER use
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
