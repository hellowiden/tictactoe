const HUMAN = "X";
const AI = "O";

class TicTacToe {
  constructor() {
    this.cells = document.querySelectorAll(".cell");
    this.currentPlayerSpan = document.getElementById("currentPlayer");
    this.scoreXSpan = document.getElementById("scoreX");
    this.scoreOSpan = document.getElementById("scoreO");
    this.newGameButton = document.querySelector(".control-button");
    this.aiDifficultySlider = document.getElementById("aiDifficulty");

    this.currentPlayer = HUMAN;
    this.scoreX = 0;
    this.scoreO = 0;
    this.gamesPlayed = 0;
    this.board = ["", "", "", "", "", "", "", "", ""];
    this.isFirstGame = true;

    this.resetGame();
    this.addEventListeners();
  }

  resetGame() {
    this.updateUI();
  }

  addEventListeners() {
    this.cells.forEach((cell, index) => {
      cell.addEventListener("click", () => {
        if (this.currentPlayer === HUMAN) {
          this.makeMove(index);
        }
      });
    });

    this.newGameButton.addEventListener("click", () => {
      this.resetBoard();
      this.resetScores();
      this.gamesPlayed++;

      if (this.isFirstGame) {
        this.currentPlayer = this.isPlayerStarting ? HUMAN : AI;
        this.isPlayerStarting = !this.isPlayerStarting;
        this.isFirstGame = false;
      } else {
        this.currentPlayer = this.isPlayerStarting ? AI : HUMAN;
        this.isPlayerStarting = !this.isPlayerStarting;
      }

      this.updateUI();

      if (this.currentPlayer === AI) {
        let aiIndex = this.calculateAIMove();
        if (aiIndex !== -1) {
          this.makeMove(aiIndex);
        }
      }
    });

    if (this.isFirstGame && this.currentPlayer === AI) {
      let aiIndex = this.calculateAIMove();
      if (aiIndex !== -1) {
        this.makeMove(aiIndex);
      }
    }
  }

  updateUI() {
    this.currentPlayerSpan.innerText = this.currentPlayer;
    this.scoreXSpan.innerText = this.scoreX;
    this.scoreOSpan.innerText = this.scoreO;
  }

  checkWin() {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    return winConditions.some((condition) => {
      return condition.every(
        (index) => this.cells[index].innerText === this.currentPlayer
      );
    });
  }

  isBoardFull() {
    return [...this.cells].every((cell) => cell.innerText !== "");
  }

  updateBoard(index) {
    this.board[index] = this.currentPlayer;
    this.cells[index].innerText = this.currentPlayer;
  }

  changePlayer() {
    this.currentPlayer = this.currentPlayer === HUMAN ? AI : HUMAN;
    this.currentPlayerSpan.innerText = this.currentPlayer;
  }

  updateScore() {
    if (this.currentPlayer === HUMAN) {
      this.scoreX++;
      this.scoreXSpan.innerText = this.scoreX;
    } else {
      this.scoreO++;
      this.scoreOSpan.innerText = this.scoreO;
    }
  }

  resetBoard() {
    this.board.fill("");
    this.cells.forEach((cell) => (cell.innerText = ""));
    this.currentPlayer = HUMAN;
    this.currentPlayerSpan.innerText = this.currentPlayer;
  }

  resetScores() {
    this.scoreX = 0;
    this.scoreO = 0;
    this.scoreXSpan.innerText = this.scoreX;
    this.scoreOSpan.innerText = this.scoreO;
  }

  calculateAIMove() {
    const difficulty = parseInt(this.aiDifficultySlider.value);
    let index = -1;

    if (difficulty > 80) {
      index = this.findWinningMove();
      if (index !== -1) return index;

      index = this.findBlockingMove();
      if (index !== -1) return index;

      index = this.takeCenter();
      if (index !== -1) return index;

      index = this.takeCorner();
      if (index !== -1) return index;
    }

    const emptyCells = this.board
      .map((val, idx) => (val === "" ? idx : null))
      .filter((val) => val !== null);

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      index = emptyCells[randomIndex];
    }

    return index;
  }

  findStrategicMove(player) {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let condition of winConditions) {
      const [a, b, c] = condition;
      if (
        this.cells[a].innerText === player &&
        this.cells[b].innerText === player &&
        this.cells[c].innerText === ""
      ) {
        return c;
      }
      if (
        this.cells[a].innerText === player &&
        this.cells[c].innerText === player &&
        this.cells[b].innerText === ""
      ) {
        return b;
      }
      if (
        this.cells[b].innerText === player &&
        this.cells[c].innerText === player &&
        this.cells[a].innerText === ""
      ) {
        return a;
      }
    }
    return -1;
  }

  findWinningMove() {
    return this.findStrategicMove(this.currentPlayer);
  }

  findBlockingMove() {
    return this.findStrategicMove(this.currentPlayer === HUMAN ? AI : HUMAN);
  }

  takeCenter() {
    return this.cells[4].innerText === "" ? 4 : -1;
  }

  takeCorner() {
    const corners = [0, 2, 6, 8];
    for (let corner of corners) {
      if (this.cells[corner].innerText === "") {
        return corner;
      }
    }
    return -1;
  }

  makeMove(index) {
    if (this.board[index] === "") {
      this.updateBoard(index);

      if (this.checkWin()) {
        alert(`Player ${this.currentPlayer} wins!`);
        this.updateScore();
        this.resetBoard();
      } else if (this.isBoardFull()) {
        alert("It's a draw!");
        this.resetBoard();
      } else {
        this.currentPlayer = this.currentPlayer === HUMAN ? AI : HUMAN;
        this.currentPlayerSpan.innerText = this.currentPlayer;

        if (this.currentPlayer === AI) {
          let aiIndex = this.calculateAIMove();
          if (aiIndex !== -1) {
            this.makeMove(aiIndex);
          }
        }
      }
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new TicTacToe();
});
