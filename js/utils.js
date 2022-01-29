function renderCell(i, j, value) {
  // Select the elCell and set the value
  var elCell = document.querySelector(`.cell-${i}-${j}`);
  elCell.innerHTML = value;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getNeighbors(idxI, idxJ, board) {
  var neighbors = [];
  for (var i = idxI - 1; i <= idxI + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = idxJ - 1; j <= idxJ + 1; j++) {
      if (i === idxI && j === idxJ) continue;
      if (j < 0 || j >= board[i].length) continue;
      if (board[i][j]) neighbors.push({
        cellContent: board[i][j],
        i: i,
        j: j
      });
    }
  }

  return neighbors;
}

function getNeighborsCount(idxI, idxJ, board) {
  var neighborsCount = 0;
  for (var i = idxI - 1; i <= idxI + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = idxJ - 1; j <= idxJ + 1; j++) {
      if (i === idxI && j === idxJ) continue;
      if (j < 0 || j >= board[i].length) continue;
      if (board[i][j]) neighborsCount++;
    }
  }

  return neighborsCount;
}


function getClassName(i, j) {
	var cellClass = 'cell-' + i + '-' + j;
	return cellClass;
}

function shuffle(items) {
  var randIdx, keep, i;
  for (i = items.length - 1; i > 0; i--) {
      randIdx = getRandomInt(0, items.length - 1);

      keep = items[i];
      items[i] = items[randIdx];
      items[randIdx] = keep;
  }
  return items;
}
