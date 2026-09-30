const GAME_DURATION_MS = 15_000;

const socket = io();
const display = document.getElementById("display");
const scoreDisplay = document.getElementById("score-display");
const startButton = document.getElementById("start-button");
const gameArea = document.getElementById("game-area");
const target = document.querySelector(".target");

let score = 0;
let endTime = 0;
let timerInterval = null;
let isRunning = false;

socket.on("leaderboard:update", fetchLeaderboard);
startButton.addEventListener("click", startGame);
target.addEventListener("click", hitTarget);

function startGame() {
  removeScoreForm();
  clearInterval(timerInterval);

  score = 0;
  isRunning = true;
  endTime = Date.now() + GAME_DURATION_MS;

  scoreDisplay.textContent = "Score: 0";
  display.textContent = "15.00 seconds";
  startButton.disabled = true;
  startButton.textContent = "Game in progress";
  target.classList.add("is-visible");

  positionTarget();
  timerInterval = setInterval(updateCountdown, 10);
}

function hitTarget() {
  if (!isRunning) return;

  score += 1;
  scoreDisplay.textContent = `Score: ${score}`;
  positionTarget();
}

function positionTarget() {
  const maxX = Math.max(0, gameArea.clientWidth - target.offsetWidth);
  const maxY = Math.max(0, gameArea.clientHeight - target.offsetHeight);

  target.style.left = `${Math.random() * maxX}px`;
  target.style.top = `${Math.random() * maxY}px`;
}

function updateCountdown() {
  const remainingMs = Math.max(0, endTime - Date.now());
  display.textContent = `${(remainingMs / 1000).toFixed(2)} seconds`;

  if (remainingMs === 0) finishGame();
}

function finishGame() {
  if (!isRunning) return;

  isRunning = false;
  clearInterval(timerInterval);
  timerInterval = null;
  target.classList.remove("is-visible");
  display.textContent = "Time's up!";
  startButton.disabled = false;
  startButton.textContent = "Play Again";
  showScoreForm();
}

function showScoreForm() {
  const leaderboardContainer = document.getElementById("leaderboard-container");
  const title = document.createElement("h2");
  const form = document.createElement("form");
  const finalScore = document.createElement("h3");
  const nameInput = document.createElement("input");
  const submitButton = document.createElement("button");

  title.id = "submit-score-header";
  title.textContent = "Submit Your Score";
  form.id = "submit-score-form";
  finalScore.textContent = `You hit ${score} targets`;
  nameInput.type = "text";
  nameInput.id = "name";
  nameInput.placeholder = "Your Name";
  nameInput.maxLength = 24;
  nameInput.required = true;
  submitButton.type = "submit";
  submitButton.id = "submit-button";
  submitButton.textContent = "Submit";

  form.append(finalScore, nameInput, submitButton);
  leaderboardContainer.append(title, form);
  nameInput.focus();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const username = nameInput.value.trim();

    if (!username) return;

    submitButton.disabled = true;
    try {
      const response = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, score }),
      });

      if (!response.ok) throw new Error("The score could not be saved.");

      removeScoreForm();
      await fetchLeaderboard();
    } catch (error) {
      console.error("Error submitting score:", error);
      alert("Error submitting score. Please try again.");
      submitButton.disabled = false;
    }
  });
}

function removeScoreForm() {
  document.getElementById("submit-score-form")?.remove();
  document.getElementById("submit-score-header")?.remove();
}

async function fetchLeaderboard() {
  try {
    const response = await fetch("/api/leaderboard/top");
    if (!response.ok) throw new Error("The leaderboard could not be loaded.");

    const leaderboard = await response.json();
    const leaderboardTable = document.getElementById("leaderboard-body");
    leaderboardTable.innerHTML = "";

    leaderboard.forEach((entry, index) => {
      const tableRow = document.createElement("tr");
      const rankCell = document.createElement("td");
      const nameCell = document.createElement("td");
      const scoreCell = document.createElement("td");

      rankCell.textContent = index + 1;
      nameCell.textContent = entry.value;
      scoreCell.textContent = entry.score;
      tableRow.append(rankCell, nameCell, scoreCell);
      leaderboardTable.appendChild(tableRow);
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
  }
}

window.addEventListener("load", fetchLeaderboard);
