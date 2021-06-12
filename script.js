let board;
let playerTurn = "x";
let winnerPlayer = "";

function getElementClass(className) {
  const el = document.getElementsByClassName(className)[0];
  return el;
}

function getRoot() {
  const root = document.getElementById("root");
  root.style.backgroundColor = "black";
  return root;
}

function changeTurn(player) {
  const el = getElementClass("turn");
  el.innerText = `É a vez do jogador: ${player}`;
}

function toggleTurn() {
  if (playerTurn === "x") playerTurn = "o";
  else playerTurn = "x";

  changeTurn(playerTurn.toUpperCase());
}

function addImage(target) {
  const imageMove = {
    x: "./assets/x.png",
    o: "./assets/o.png",
  };

  const image = document.createElement("img");
  image.src = imageMove[playerTurn];
  image.classList.add("symbol");
  target.appendChild(image);
}

function updateBoard(target) {
  const row = target.getAttribute("row");
  const column = target.getAttribute("column");
  board[row][column] = { ...board[row][column], value: playerTurn };
}

function didPlayerWin() {
  for (const [rowIndex, row] of board.entries()) {
    const winByRow = row.every((cell) => cell.value === playerTurn);
    const winByColumn = row.every(
      (_, index) => board[index][rowIndex].value === playerTurn
    );
    if (winByColumn || winByRow) return true;
  }
  const winByMainDiagonal = board[0].every(
    (_, index) => board[index][index].value === playerTurn
  );
  const winBySecondaryDiagonal =
    (board[0][2].value === board[1][1].value) === board[2][0].value;

  return winByMainDiagonal || winBySecondaryDiagonal;
}

function didGameDraw() {
  const allCells = board.flat();
  const allMoves = allCells.map((cell) => cell.value);
  const validMoves = allMoves.filter((value) => value);
  return allMoves.length === validMoves.length;
}

function clearGame() {
  const modal = getElementClass("modal");
  modal.remove();

  const grid = getElementClass("grid");
  grid.remove();

  const startButton = getElementClass("start-button");
  startButton.classList.remove("hidden");
}

function endGame(playerWon) {
  if (playerWon) winnerPlayer = playerTurn;
  board.forEach((row) => {
    row.forEach((cell) => {
      cell.dom.removeEventListener("click", makeMove);
    });
  });

  const modal = document.createElement("div");
  modal.classList.add("modal");
  if (winnerPlayer) {
    modal.innerText = `O jogador ${playerTurn.toUpperCase()} ganhou!`;
    const winnerNode = document.getElementById(winnerPlayer);
    const numberWins = Number(winnerNode.innerText.replace(/\D/g, ""));
    winnerNode.innerText = `O jogador ${playerTurn} ganhou: ${
      numberWins + 1
    } vezes`;
  } else {
    modal.innerText = "O jogo terminou empatado";
    const drawNode = document.getElementById("draws");
    const numberDraws = Number(drawNode.innerText.replace(/\D/g, ""));
    drawNode.innerText = `Houveram ${numberDraws + 1} jogos empatados`;
  }
  const okButton = document.createElement("button");
  okButton.innerText = "Ok";
  okButton.classList.add("ok-button");
  okButton.addEventListener("click", clearGame);
  root.appendChild(modal);
  modal.appendChild(okButton);

  winnerPlayer = "";
}

function makeMove({ target }) {
  addImage(target);
  updateBoard(target);
  const playerWon = didPlayerWin();
  const gameDraw = didGameDraw();
  if (playerWon || gameDraw) {
    endGame(playerWon);
    return;
  }
  toggleTurn();
  target.removeEventListener("click", makeMove);
}

function createCell(rowIndex, columnIndex) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  cell.addEventListener("click", makeMove);
  cell.setAttribute("row", rowIndex);
  cell.setAttribute("column", columnIndex);
  return cell;
}

function makeBoard() {
  const row = new Array(3).fill("");
  const tempBoard = new Array(3).fill(row);

  const root = getRoot();
  const footer = getElementClass("footer");
  const grid = document.createElement("div");
  grid.classList.add("grid");
  root.insertBefore(grid, footer);

  board = tempBoard.map((row, rowIndex) => {
    const tempRow = row.map((_, columnIndex) => {
      const cell = createCell(rowIndex, columnIndex);

      grid.appendChild(cell);

      return { dom: cell, value: "" };
    });
    return tempRow;
  });
}

function startGame() {
  const startButton = document.getElementsByClassName("start-button")[0];
  startButton.classList.add("hidden");
  makeBoard();
}

function makeHeader() {
  const root = getRoot();
  const header = document.createElement("header");
  const title = document.createElement("h1");
  title.innerText = "Jogo da Velha";

  const turn = document.createElement("p");
  turn.classList.add("turn");

  const startButton = document.createElement("button");
  startButton.innerText = "Começar o jogo";
  startButton.classList.add("start-button");
  startButton.addEventListener("click", startGame);

  header.appendChild(title);
  header.appendChild(turn);
  header.appendChild(startButton);
  root.appendChild(header);
}

function makeFooter() {
  const footer = document.createElement("footer");
  footer.classList.add("footer");
  const root = getRoot();

  const numberWinningX = document.createElement("p");
  const numberWinningO = document.createElement("p");
  const numberDraws = document.createElement("p");

  numberWinningX.id = "x";
  numberWinningO.id = "o";
  numberDraws.id = "draws";

  numberWinningX.innerText = "O jogador X ganhou: 0 vezes";
  numberWinningO.innerText = "O jogador O ganhou: 0 vezes";
  numberDraws.innerText = "Houveram 0 jogos empatados";

  footer.appendChild(numberWinningO);
  footer.appendChild(numberWinningX);
  footer.appendChild(numberDraws);
  root.appendChild(footer);
}

makeHeader();
makeFooter();
