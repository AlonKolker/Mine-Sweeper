function renderBoard(board) {
  var strHTML = "";

  for (var i = 0; i < gLevel.SIZE; i++) {
    strHTML += "<tr>\n";
    for (var j = 0; j < gLevel.SIZE; j++) {
      var className = "cell-hiden";

      strHTML += `\t<td id="cell-${i}-${j}" class="' + ${className} + "onclick="ellClicked(this,event, ${i} ,${j})"
                    oncontextmenu="cellMarked(event,this,${i},${j})">  </td>\n`; //for right click butten
    }
    strHTML += "\t</tr>\n";
  }
  // strHTML += "</tbody></table>";

  var elContainer = document.querySelector(".board");
  elContainer.innerHTML = strHTML;
}
