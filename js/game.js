'use strict'

var gLevel = {
    SIZE: 4,
    MINES: 2
};


var gGame = {
    isOn: true,
    shownCount: 0
};

var gBoard;

function initGame() {
    renderBoard(gBoard);
}


buildBoard();
function buildBoard() {
    gBoard = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        gBoard[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            gBoard[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            };
        }
    }

    gBoard[1][1].isMine = true;
    gBoard[1][1].isShown = true;
    gBoard[3][2].isMine = true;
    gBoard[3][2].isShown = true;

    return gBoard;

}

function renderBoard(board) {
    var strHTML = '';

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {

            var cell = board[i][j];
            cell.minesAroundCount = setMinesNegsCount(i, j, board);
            var minesNesCount = cell.minesAroundCount;

            var className = `class = "cell-${i}-${j}`;
            if (cell.isShown) className += ' shown';
            if (minesNesCount > 0){
                className += ` negs-${cell.minesAroundCount}`;                   
            } else className += ' empty'

            strHTML += `<td ${className}" onclick="cellClicked()">`
            if (cell.isMine) strHTML += `<img src="img/mine.png" alt="">`
            else if (minesNesCount > 0) strHTML += `${minesNesCount}`
            strHTML += `</td>\n`
        }
        strHTML += '</tr\n>'
    }

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
    console.log(strHTML);
}

function setMinesNegsCount(idxI, idxJ, board) {
    var minesNesCount = 0;
    for (var i = idxI - 1; i <= idxI + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = idxJ - 1; j <= idxJ + 1; j++) {
            if (i === idxI && j === idxJ) continue;
            if (j < 0 || j >= board[i].length) continue;
            if (board[i][j].isMine) minesNesCount++;
        }
    }
    return minesNesCount;
}

