class Board {
    /* Spielsteine */
    static stones = ["\x0a", "\u26AA", "\u26AB"];

    /* Brett */
    state;

    /* aktiver Spieler */
    currentPlayer = 1;

    /* erstelle leeres Brett */
    constructor(length = 3 /*, dims = 2 */) {
        this.state = Array(length).fill(0).map(() => Array(length).fill(0));
        this.createBoard()
    }

    /* nächsten Spieler aktivieren */
    nextPlayer() {
        this.currentPlayer ^= 3;
    }

    /* zeichne Brett */
    createBoard() {
        let b = `<h1 id="title">Tic Tac Toe</h1>`;
        b += `<table>`;
        this.state.forEach(
            (row, x) => (b += "<tr>", row.forEach(
                (field, y) => (b += `
                    <th id="o${x}${y}"
                    onclick="board.play(${x},${y})"
                    class="${((x + y) % 2 ? "light" : "dark")}">`)
            ))
        );
        b += `</table>`;
        document.getElementById("game").innerHTML = b;
    }

    /* zeige die Spielsteine auf dem Brett */
    updateBoard() {
        this.state.forEach(
            (row, x) => (row.forEach(
                (field, y) => (
                    document.getElementById("o"+x+y).innerHTML = Board.stones[field])
            ))
        );
    }

    /* zeige den Gewinner an */
    static showWinner(winner) {
        let title = document.getElementById("title");
        if(winner) {
            title.innerHTML = `Player ${Board.stones[winner]} wins!`;
            title.classList.add("win");
        } else {
            title.innerHTML = `No winner`;
            title.classList.add("draw");
        }
        document.getElementById("game").innerHTML += `
            <button class="right" onclick="newGame()">New Game</button>`;
    }

    /* gibt es leere Felder ? */
    hasEmpty() {
        let empty = this.state.flat().some(i => i === 0);
        return empty;
    }

    /* gewinnt diese Linie ? */
    static lineHasWinner(line) {
        let winner = line.reduce((a,b) => a&b);
        return winner;
    }

    /* gibt es einen Gewinner ? */
    hasWinner() {
        let winner = 0;
        // zeilen prüfen
        for(let x = 0; ! winner && x < this.state.length; x++) {
            winner = Board.lineHasWinner(this.state[x]);
        }
        // spalten prüfen
        for(let y = 0; ! winner && y < this.state.length; y++) {
            winner = Board.lineHasWinner(this.state.map(arr => arr[y]));
        }
        // diagonale1 prüfen
        if(!winner) {
            let diag1 = this.state.map((arr, index) => arr[index]);
            winner = Board.lineHasWinner(diag1);
        }
        // diagonale2 prüfen
        if(!winner) {
            let diag2 = this.state.map((arr, index) => arr[arr.length - 1 - index]);
            winner = Board.lineHasWinner(diag2);
        }
        return winner;
    }

    /* setze den nächsten Spielstein auf das Feld x,y */
    play(x, y) {
        if(! this.state[x][y] && ! this.hasWinner()) {
            this.state[x][y] = this.currentPlayer;
            this.updateBoard();
            let winner = this.hasWinner();
            if (winner) {
                Board.showWinner(winner);
                return winner;
            }
            let empty = this.hasEmpty();
            if (! empty) {
                Board.showWinner(empty);
                return empty;
            }
            this.nextPlayer();
        }
    }
}

/* starte neues Spiel */
function newGame() {
    board = new Board();
}
