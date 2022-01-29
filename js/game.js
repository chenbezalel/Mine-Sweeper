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
var gFlaggedCount;
var gShownCount;
var gSecPass;
var gTimerintervalId;
var gIsFirstClicked;
var gIsVictory;
var gLives;
var gIshint;
var gHints;
var gSafeClickCounter;
var gSafeCell;

const MINE_IMG = `<img class ="mine" src="img/mine.png" alt="">`


function initGame() {
    buildBoard();
    renderBoard(gBoard);
    stopTimer();
    gGame.isOn = true;
    gIsFirstClicked = false;
    gIsVictory = false;
    gIshint = false;
    gFlaggedCount = 0;
    gShownCount = 0;
    gLives = 3;
    gHints = 3;
    gSafeClickCounter = 3;
}


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
            if (!cell.isMine) {
                if (minesNesCount > 0) className += ` negs-${cell.minesAroundCount}`;
            }
            if (cell.isShown) className += ` shown`

            strHTML += `<td ${className}" onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="addFlag(this, ${i}, ${j}); return false;"></td>\n`
        }
        strHTML += '</tr\n>'
    }

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;

    var elRestart = document.querySelector('.restart');
    elRestart.style.backgroundImage = "url('img/gameOn.png')";

    var elLives = document.querySelector('.lives');
    elLives.innerText = 'lives:💝💝💝';

    var elHints = document.querySelector('.hints');
    elHints.innerText = 'hints:💡💡💡';

}


function cellClicked(elCell, i, j) {

    var cell = gBoard[i][j];

    if (!gGame.isOn) return;
    if (cell.isMarked) return;


    if (!gIsFirstClicked) {
        gIsFirstClicked = true;
        startTimer();
        placeMines(gBoard, i, j);
        return;
    }

    if (gIshint) {
        applyHint(i, j);
        gIshint = false;
        return;
    }

    if (cell.isMine) {
        mineClicked(i, j);
    } else {
        elCell.classList.add('shown');
        cell.isShown = true;
        gShownCount++;
        if (cell.minesAroundCount > 0) {
            renderCell(i, j, cell.minesAroundCount)
        } else {
            renderCell(i, j, ' ');
            emptyCellClicked(i, j);
        }
    }

    isVictory();
}


function placeMines(board, clickI, clickJ) {

    var cell = board[clickI][clickJ];

    for (var i = 0; i < gLevel.MINES; i++) {

        var idxI = getRandomInt(0, (gLevel.SIZE - 1));
        var idxJ = getRandomInt(0, (gLevel.SIZE - 1));

        while ((clickI === idxI && clickJ == clickJ) || gBoard[idxI][idxJ].isMine) {
            idxI = getRandomInt(0, (gLevel.SIZE - 1));
            idxJ = getRandomInt(0, (gLevel.SIZE - 1));
        }
        gBoard[idxI][idxJ].isMine = true;
    }

    cell.isShown = true;
    gShownCount++;
    renderBoard(board);

    if (cell.minesAroundCount > 0) {
        renderCell(clickI, clickJ, cell.minesAroundCount);
    } else {
        renderCell(clickI, clickJ, ' ');
        emptyCellClicked(clickI, clickJ);
    }
}


function mineClicked(idxI, idxJ) {
    gLives--;
    var elLives = document.querySelector('.lives');


    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];

            if (!cell.isMine) continue;
            if (cell.isMarked) continue;
            if (gLives !== 0) {
                if (gLives === 2) elLives.innerText = 'lives: 💝💝';
                else if (gLives === 1) elLives.innerText = 'lives: 💝';
                renderCell(idxI, idxJ, MINE_IMG);
                setTimeout(function () {
                    renderCell(idxI, idxJ, '');
                }, 500);
                return;

            } else {
                elLives.innerText = 'lives:';
                var elMine = document.querySelector('.' + getClassName(i, j));
                elMine.classList.add('shown');
                renderCell(i, j, MINE_IMG)
                gameOver();
            }
        }
    }
}



function emptyCellClicked(idxI, idxJ) {
    var neighbors = getNeighbors(idxI, idxJ, gBoard);

    for (var i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i];

        if (!gBoard[neighbor.i][neighbor.j].isMarked) {
            if (!gBoard[neighbor.i][neighbor.j].isShown) {

                neighbor.cellContent.isShown = true;
                var elNeighbor = document.querySelector('.' + getClassName(neighbor.i, neighbor.j))
                elNeighbor.classList.add('shown');
                gShownCount++;

                var nesMinesCount = neighbor.cellContent.minesAroundCount;
                if (nesMinesCount > 0) {
                    renderCell(neighbor.i, neighbor.j, nesMinesCount)
                } else {
                    renderCell(neighbor.i, neighbor.j, ' ');
                    emptyCellClicked(neighbor.i, neighbor.j);
                }
            }
        }

    }

}


function gameOver() {
    stopTimer();
    gGame.isOn = false;
    var elRestart = document.querySelector('.restart');
    if (gIsVictory) {
        elRestart.style.backgroundImage = "url('img/win.png')";
    } else {
        elRestart.style.backgroundImage = "url('img/lose.png')";
    }


}

function isVictory() {
    if (gFlaggedCount + gShownCount === gLevel.SIZE ** 2) {
        if (gFlaggedCount === gLevel.MINES) {
            gIsVictory = true;
            bestScore();
            gameOver();
        }
    }

}


function startTimer() {
    var startTime = Date.now();
    gTimerintervalId = setInterval(function () {
        gSecPass = ((Date.now() - startTime) / 1000).toFixed(2);
        var elTimer = document.querySelector('.timer')
        elTimer.innerText = ('Time pass: ' + gSecPass);
    }, 100)

}

function stopTimer() {
    clearInterval(gTimerintervalId);
}

function addFlag(elCell, i, j) {
    if (elCell.classList.contains('shown')) return;

    if (!elCell.innerText) {
        elCell.innerText = '🚩';
        gFlaggedCount++;
        if (gFlaggedCount === 1 && !gIsFirstClicked) startTimer();
        gBoard[i][j].isMarked = true;
        isVictory();
    } else {
        elCell.innerText = '';
        gBoard[i][j].isMarked = false;
        gFlaggedCount--;
    }
}

function setMinesNegsCount(idxI, idxJ, board) {
    var minesNesCount = 0;
    var neighbors = getNeighbors(idxI, idxJ, board)

    for (var i = 0; i < neighbors.length; i++) {
        if (neighbors[i].cellContent.isMine) minesNesCount++
    }

    return minesNesCount;
}

function chekLevel(size = 4, minesNum = 2) {
    gLevel.SIZE = size;
    gLevel.MINES = minesNum,
        buildBoard();
    renderBoard(gBoard);
}

function safeClick() {
    if (gSafeClickCounter === 0) return;
    gSafeClickCounter--
    var safeclicks = [];

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var Cell = gBoard[i][j];
            if (!Cell.isMarked && !Cell.isShown && !Cell.isMine) {
                safeclicks.push({
                    i: i,
                    j: j
                });
            }
        }
    }

    shuffle(safeclicks);
    gSafeCell = safeclicks.pop();

    var elCell = document.querySelector('.' + getClassName(gSafeCell.i, gSafeCell.j));
    var elClicksCounter = document.querySelector('.clicks-available')
    elCell.style.backgroundColor = 'lightGreen';
    elClicksCounter.innerText = `${gSafeClickCounter} clicks available`;

    setTimeout(function () {
        var elCell = document.querySelector('.' + getClassName(gSafeCell.i, gSafeCell.j));
        elCell.style.backgroundColor = null;
    }, 2000);
}


function hintClicked(elHint) {
    if (!gIsFirstClicked) return;
    if (gHints > 0) gIshint = true;
    gHints--;
    if (gHints === 2) elHint.innerText = 'hints: 💡💡';
    if (gHints === 1) elHint.innerText = 'hints: 💡';
    if (gHints === 0) elHint.innerText = 'hints: ';
}



function applyHint(idxI, idxJ) {
    var neighbors = getNeighbors(idxI, idxJ, gBoard);
    neighbors.push({
        cellContent: gBoard[idxI][idxJ],
        i: idxI,
        j: idxJ
    });

    for (var i = 0; i < neighbors.length; i++) {
        var neighbor = neighbors[i];

        if (gBoard[neighbor.i][neighbor.j].isMarked) continue;
        if (gBoard[neighbor.i][neighbor.j].isShown) continue;

        var elNeighbor = document.querySelector('.' + getClassName(neighbor.i, neighbor.j));

        elNeighbor.style.backgroundColor = 'yellow';

        var nesMinesCount = neighbor.cellContent.minesAroundCount;
        if (neighbor.cellContent.isMine) renderCell(neighbor.i, neighbor.j, MINE_IMG);
        else if (nesMinesCount > 0) renderCell(neighbor.i, neighbor.j, nesMinesCount);
        else renderCell(neighbor.i, neighbor.j, ' ');

        setTimeout(function () {
            for (var i = 0; i < neighbors.length; i++) {
                var neighbor = neighbors[i];
                if (gBoard[neighbor.i][neighbor.j].isMarked) continue;
                if (gBoard[neighbor.i][neighbor.j].isShown) continue;
                var elNeighbor = document.querySelector('.' + getClassName(neighbor.i, neighbor.j));
                elNeighbor.style.backgroundColor = null;
                renderCell(neighbor.i, neighbor.j, '');
            }
        }, 1000)
    }
}


// function bestScore() {
//     if (typeof (Storage) !== "undefined") {
//         if (localStorage.bestScore) {
//             if (gSecPass > localStorage.bestScore) return;
//             else localStorage.bestScore = gSecPass;
//        } else {
//             localStorage.bestScore = gSecPass;
//         }
//     }

//     var elBestTime = document.querySelector('.best-time')
//     elBestTime.innerText = `Best time: ${localStorage.bestScore}`;

// 
// }