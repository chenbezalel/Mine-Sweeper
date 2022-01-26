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
    buildBoard();
    renderBoard(gBoard);
}

const COVER_IMG = `<img class ="cover" src="img/cover.jpg" alt="">`
const MINE_IMG = `<img class ="mine" src="img/mine.png" alt="">`

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

    for (var i = 0; i < gLevel.MINES; i++) {
        var idxI = getRandomInt(0, (gLevel.SIZE - 1));
        var idxJ = getRandomInt(0, (gLevel.SIZE - 1));
        gBoard[idxI][idxJ].isMine = true;
        gBoard[idxI][idxJ].isShown = true;
    }

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
            // if (cell.isShown) className += ' shown';
            if (minesNesCount > 0) {
                className += ` negs-${cell.minesAroundCount}`;
            } else className += ' empty'

            strHTML += `<td ${className}" onclick="cellClicked(this, ${i}, ${j})"></td>\n`
        }
        strHTML += '</tr\n>'
    }

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
    console.log(strHTML);
}

function cellClicked(elCell, i, j) {
    console.log(elCell);
    var cell = gBoard[i][j];
    cell.isShown = true;
    elCell.classList.add('shown');
    if (cell.isMine) {
        renderCell(i, j, MINE_IMG);
    } else {
        if (cell.minesAroundCount > 0) {
            renderCell(i, j, cell.minesAroundCount)
        } else {
            renderCell(i, j, '')
        }

    }
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

function chekLevel(size = 4, minesNum = 2) {
    gLevel.SIZE = size;
    gLevel.MINES = minesNum,
    buildBoard();
    renderBoard(gBoard);
}

