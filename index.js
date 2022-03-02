import { aiNext } from "./helper.js";
//init
const statusDisplay = document.querySelector(".game--status");

const histories = [];
let history = {
  namePlayer: "newer",
  currentPlayer: "X",
  opponent: "AI",
  size: 3,
  gameState: ["X", "O", "X", "O", "X", "O", "X", "O", ""],
};
histories.push(history);

let gameActive = true;
let namePlayer = "newer";
let opponent = "AI";
let currentPlayer = "X";
let size = 3;
let gameState = [...new Array(size * size)].map((x) => "");
let aiStatus = false;

const winningMessage = () => `Player  ${currentPlayer}  has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's  ${currentPlayer} 's turn`;

statusDisplay.innerHTML = currentPlayerTurn();

let winningConditions = [];
setWinConditions(size);

var select = document.querySelector(".history-select");

var history_array = ["newer"];

var select = document.querySelector(".history-select");
for (let i = 0; i < history_array.length; i++) {
  select.options[i] = new Option(history_array[i], history_array[i]);
}
//get one's history record with drop down select
function getHistory() {
  var select = document.querySelector(".history-select");

  let namePlayer = select.options[select.selectedIndex].value;

  for (let history of histories) {
    if (history.namePlayer === namePlayer) {
      currentPlayer == history.currentPlayer;
      opponent = history.opponent;
      gameState = history.gameState;
      size = history.size;

      break;
    } else {
      namePlayer == "newer";
      currentPlayer = "X";
      opponent = "AI";
      size = 3;
      gameState = [...new Array(size * size)].map((x) => "");
    }
  }
  handleInitGameHistory();
}
//set the game statue as record
function handleInitGameHistory() {
  setCells(false);
}
//record after cell clicked
function setHistory() {
  let flag = false;
  let current = {
    namePlayer: "newer",
    currentPlayer: "X",
    opponent: "AI",
    size: 3,
    gameState: ["X", "O", "X", "O", "X", "O", "X", "O", ""],
  };
  for (let history of histories) {
    if (history.namePlayer === namePlayer) {
      history.currentPlayer = currentPlayer;
      history.opponent = opponent;
      history.gameState = gameState;
      history.size = size;
      flag = true;

      break;
    }
  }
  if (!flag) {
    histories.push({
      namePlayer: namePlayer,
      currentPlayer: currentPlayer,
      opponent: opponent,
      gameState: gameState,
    });
  }
}
//add user's name for record
function getNewName() {
  var inputVal = document.getElementById("newName").value;
  namePlayer = inputVal;

  if (!history_array.includes(inputVal)) history_array.push(inputVal);

  select = document.querySelector(".history-select");

  for (let i = 0; i < history_array.length; i++) {
    select.options[i] = new Option(history_array[i], history_array[i]);
    if (select.options[i] === namePlayer)
      select.options[i].selected = "selected";
  }

  handleRestartGame();
}
//calculate the win conditions with size
function setWinConditions(size) {
  winningConditions = [];
  for (let i = 0; i < size; i++) {
    let arr1 = [];
    let arr2 = [];
    for (let j = 0; j < size; j++) {
      arr1.push(i * size + j);
      arr2.push(j * size + i);
    }

    winningConditions.push(arr1);
    winningConditions.push(arr2);
  }
  let arr3 = [];
  let arr4 = [];
  for (let i = 0; i < size; i++) {
    arr3.push(i * (size + 1));
    arr4.push((i + 1) * (size - 1));
  }

  winningConditions.push(arr3);
  winningConditions.push(arr4);
}
//after cell clicked
function handleCellPlayed(clickedCell, clickedCellIndex) {
  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.innerHTML = currentPlayer;
}
//AI clicks on the index output by aiNext() in helper.js
function aiPlay() {
  let aiIndex = aiNext(
    gameState,
    winningConditions,
    currentPlayer === "X" ? "O" : "X"
  );

  gameState[aiIndex] = currentPlayer;
  let clickedCell = document.querySelectorAll(".cell")[aiIndex];

  clickedCell.innerHTML = currentPlayer;

  handleCellPlayed(clickedCell, aiIndex);
  handleResultValidation();
}
//player change after cell click
function handlePlayerChange() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusDisplay.innerHTML = currentPlayerTurn();
}
//check win or draw or continue after cell click
function handleResultValidation() {
  let won = false;

  for (let condition of winningConditions) {
    let temp = gameState[condition[0]];

    let i = 1;
    for (; i < condition.length; i++) {
      if (
        temp !== gameState[condition[i]] ||
        gameState[condition[i]].length === 0
      ) {
        break;
      } else {
      }
    }
    if (i === condition.length) {
      won = true;
    }
  }

  if (won) {
    statusDisplay.innerHTML = winningMessage();
    gameActive = false;
    return;
  }

  let roundDraw = !gameState.includes("");
  if (roundDraw) {
    statusDisplay.innerHTML = drawMessage();
    gameActive = false;
    return;
  }
  setHistory();

  handlePlayerChange();
  if (opponent === "AI") aiStatus = !aiStatus;
  if (aiStatus) aiPlay();
}
//after clicking cell, judge it
function handleCellClick(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = parseInt(
    clickedCell.getAttribute("data-cell-index")
  );

  if (gameState[clickedCellIndex] !== "" || !gameActive) {
    return;
  }

  handleCellPlayed(clickedCell, clickedCellIndex);
  handleResultValidation();
}
//set status for restart
function handleRestartGame() {
  document.querySelector(".game--restart").innerHTML = "Restart";
  opponent = "AI";

  size = 3;
  gameState = [...new Array(size * size)].map((x) => "");
  aiStatus = false;

  gameActive = true;
  currentPlayer = "X";
  gameState = [...new Array(size * size)].map((x) => "");
  setCells(true);
  statusDisplay.innerHTML = currentPlayerTurn();

  document.querySelectorAll(".cell").forEach((cell) => (cell.innerHTML = ""));
  document
    .querySelectorAll(".cell")
    .forEach((cell) => cell.addEventListener("click", handleCellClick));
}
//set cells to "" when reset, else to values of gameState
function setCells(reset) {
  setWinConditions(size);
  gameActive = true;
  currentPlayer = "X";
  opponent = "AI";
  if (reset) gameState = [...new Array(size * size)].map((x) => "");
  var container = document.querySelector(".game--container");

  var toAdd = document.createDocumentFragment();
  for (var i = 0; i < size * size; i++) {
    var newDiv = document.createElement("div");
    newDiv.setAttribute("data-cell-index", i);
    newDiv.className = "cell";
    newDiv.innerHTML = gameState[i];
    newDiv.style.setProperty("width", 300 / size + "px");
    newDiv.style.setProperty("height", 300 / size + "px");
    newDiv.style.setProperty("font-size", 180 / size + "px");
    newDiv.style.setProperty("line-height", 300 / size + "px");

    toAdd.appendChild(newDiv);
  }
  container.innerHTML = "";
  container.appendChild(toAdd);
  let str = "repeat(" + size + ", auto)";

  container.style.setProperty("grid-template-columns", str);

  document
    .querySelectorAll(".cell")
    .forEach((cell) => cell.addEventListener("click", handleCellClick));
}
//init game with size
function handleInitGame(clickedInitEvent) {
  const clickedCell = clickedInitEvent.target;
  var newSize = parseInt(clickedCell.value);
  size = newSize;
  setCells(true);
}
////init game with AI
function handleInitGameAI(clickedInitEvent) {
  const clickedCell = clickedInitEvent.target;
  var newOpponent = clickedCell.value;

  opponent = newOpponent;

  setCells(true);
}

document
  .querySelector(".game--restart")
  .addEventListener("click", handleRestartGame);
document
  .querySelector(".size-select")
  .addEventListener("change", handleInitGame);
document
  .querySelector(".AI-select")
  .addEventListener("change", handleInitGameAI);

document.querySelector(".new-name").addEventListener("click", getNewName);
document.querySelector(".get-history").addEventListener("click", getHistory);

document.querySelector(".game--container").classList.add("hide");
