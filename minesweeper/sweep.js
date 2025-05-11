const n = 9, m = 9, bombsCount = 10
const dx = [-1, 1, 0, 0, -1, 1, -1, 1]
const dy = [0, 0, -1, 1, -1, -1, 1, 1]

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

let isBomb = Array(n * m).fill(false).fill(true, 0, bombsCount)
shuffle(isBomb)
isBomb = Array(n).fill([]).map((_, i) => Array(m).fill(false).map((_, j) => isBomb[i * m + j]));

function countBombs(x, y) {
    let count = 0
    for (let i = 0; i < 8; i++) {
        let nx = x + dx[i]
        let ny = y + dy[i]
        if (0 <= nx && nx < n && 0 <= ny && ny < m && isBomb[nx][ny]) {
            count += 1
        }
    }
    return count
}

let bombs = Array(n).fill([]).map((_, i) => Array(m).fill(false).map((_, j) => countBombs(i, j)));
let markedAsBomb = Array(n).fill([]).map((_) => Array(m).fill(false))
let revealed = Array(n).fill([]).map((_) => Array(m).fill(false))
let markedAsBombCount = 0

function getId(x, y) {
    return `${x}_${y}`
}

function isInside(x, y) {
    return 0 <= x && x < n && 0 <= y && y < m
}

function markAsBomb(x, y) {
    markedAsBomb[x][y] = true
    markedAsBombCount += 1
    let cell = document.getElementById(getId(x, y))
    cell.textContent = "🚩"
}

function unmarkAsBomb(x, y) {
    markedAsBomb[x][y] = false
    markedAsBombCount -= 1
    let cell = document.getElementById(getId(x, y))
    cell.textContent = ""
}

function reveal(x, y) {
    if (revealed[x][y] === true) {
        return
    }

    revealed[x][y] = true
    let queue = Array()
    queue.push([x, y])
    for (let k = 0; k < queue.length; k ++) {
        let [x, y] = queue[k]
        console.log(x, y, isBomb[x][y])
        console.log(revealed[x][y])
        let cell = document.getElementById(getId(x, y))
        cell.textContent = isBomb[x][y] ? "💣" : bombs[x][y].toString()
        if (isBomb[x][y]) {
            return
        }

        if (bombs[x][y] !== 0) {
            continue
        }

        for (let dir = 0; dir < 8; dir ++) {
            let nx = x + dx[dir], ny = y + dy[dir]
            if (!isInside(nx, ny)) {
                continue
            }
            if (revealed[nx][ny] || isBomb[nx][ny]) {
                continue
            }
            revealed[nx][ny] = true
            queue.push([nx, ny])
        }
    }
}

function isWin() {
    if (markedAsBombCount !== bombsCount) {
        return false
    }
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            if (isBomb[i][j] !== markedAsBomb[i][j]) {
                return false
            }
        }
    }
    return true
}

function initGame() {
    let mineField = document.getElementById("mine-field");
    let table = document.createElement("div")
    table.className = "synth-container"
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            let cell = document.createElement("div");
            cell.id = getId(i, j)
            cell.className = "synth-cell"
            cell.textContent = ""

            cell.addEventListener("mousedown", (e) => {
                let [x, y] = e.currentTarget.id.split("_").map((v) => parseInt(v))
                if (revealed[x][y]) {
                    return
                }

                if (e.button === 2) {
                    if (markedAsBomb[x][y]) {
                        unmarkAsBomb(x, y)
                    } else {
                        markAsBomb(x, y)
                    }
                    if (isWin()) {
                        table.classList.add("synth-win")
                    }
                } else {
                    if (isBomb[x][y]) {
                        table.classList.add("synth-lose")
                        revealAll()
                    } else {
                        reveal(x, y)
                    }
                }
            })

            cell.addEventListener("contextmenu", (e) => {
                e.preventDefault();
            })
            table.appendChild(cell)
        }
    }
    mineField.appendChild(table)
}


function revealAll() {
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            reveal(i, j)
        }
    }
}
