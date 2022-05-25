function renderBoard(board) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < gLevel.SIZE; i++) {
      strHTML += '<tr>\n';
      for (var j = 0; j <gLevel.SIZE; j++) {

        // var cell = board[i][j].minesAroundCount//print to the dom - for sanity
        // if(board[i][j].isMine)   cell = MINE
        
        var className =  'cell-hiden'
       
        strHTML += `\t<td id="cell-${i}-${j}" class="' + ${className} + "onclick="ellClicked(this,event, ${i} ,${j})"
                    oncontextmenu="cellMarked(event,this,${i},${j})">  </td>\n`
      }
      strHTML += '\t</tr>\n'
    }
    strHTML += '</tbody></table>';

    var elContainer = document.querySelector('.board-container');
    elContainer.innerHTML = strHTML;
  }


//   function getIdName(location) {
//     var cellClass = 'cell-' + location.i + '-' + location.j;
//     return cellClass;
//   }
  
//   function getCellCoord(strCellId) {
//     var parts = strCellId.split('-');
//     var coord = { i: +parts[1], j: +parts[2] };
//     return coord;
//   }
  