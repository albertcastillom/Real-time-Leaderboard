//socket.io setup
const socket = io();

socket.on("leaderboard:update", (leaderboard) => {
  fetchLeaderboard(leaderboard);
});

//timer setip
let startTime = 0;
let elapsedTime = 0;
let timerInterval = null;
let isRunning = false;

const display = document.getElementById("display");

function startTimer() {
  resetGame(); // Reset timer before starting
  if (!isRunning) {
    isRunning = true;
    // Adjusts start time if resuming from a paused state
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(updateDisplay, 10); // Updates every 10ms
  }
}

// pause clock
function stopTimer() {
  if (isRunning) {
    isRunning = false;
    clearInterval(timerInterval);
  }
}

// Reset to 0
function resetTimer() {
  isRunning = false;
  clearInterval(timerInterval);
  startTime = 0;
  elapsedTime = 0;
  display.textContent = "00:00";
}

// Calculates elapsed time components and updates the DOM
function updateDisplay() {
  //elapsed time in ms format
  elapsedTime = Date.now() - startTime;

  let seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
  let centiseconds = Math.floor((elapsedTime % 1000) / 10);

  //pad with leading zeros
  seconds = String(seconds).padStart(2, "0");
  centiseconds = String(centiseconds).padStart(2, "0");

  display.textContent = `${seconds}:${centiseconds} seconds`;
}

//game logic press all targets to stop the timer and submit score
const targets = document.querySelectorAll(".target");
let targetsHit = 0;

//set event for each target
targets.forEach((target) => {
  target.addEventListener("click", () => {
    if (isRunning) {
      targetsHit++;
      target.style.backgroundImage = `repeating-radial-gradient(circle, #48ff30, #48ff30 20px, #1a1616 20px, #1a1616 40px)`; // Change color to indicate hit
      target.style.pointerEvents = "none"; // Disable further clicks

      if (targetsHit === targets.length) {
        stopTimer();
        submitScore();
      }
    }
  });
});

// Submit score to the backend
function submitScore() {
  //get score from display
  const display = document.getElementById("display");
  const displayTime = display.textContent;
  //clean scroe from display to be sumbitted to backend
  //const score =displayTime === "00:00"? 0: parseFloat(displayTime.split(":")[0] + "." + displayTime.split(":")[1]);
  const score = Number((elapsedTime / 1000).toFixed(2));

  //make score card with name input to submit to backend
  const title = document.createElement("h2");
  title.textContent = "Submit Your Score";
  const form = document.createElement("form");
  form.id = "submit-score-form";

  // display score
  const scoreDisplay = document.createElement("h3");
  scoreDisplay.textContent = `Your Score: ${score} seconds`;
  form.appendChild(scoreDisplay);

  // Create name input
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.id = "name";
  nameInput.placeholder = "Your Name";
  nameInput.required = true;

  form.appendChild(nameInput);

  // Create submit button
  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  submitButton.id = "submit-button";
  submitButton.textContent = "Submit";

  form.appendChild(submitButton);

  // Append form to the leaderboard container
  const leaderboardContainer = document.getElementById("leaderboard-container");
  leaderboardContainer.appendChild(title);
  leaderboardContainer.appendChild(form);

  const nameValue = document.getElementById("name");
  const username = nameInput.value.trim();

  const submitButtonElement = document.getElementById("submit-button");
  submitButtonElement.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent form submission

    const username = nameInput.value.trim();

    if (!username) {
      alert("Please enter your name.");
      return;
    }

    fetch("/api/score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, score }),
    })
      .then((response) => response.json())
      .then((data) => {
        //resert game after score submission
        resetGame();
        //remove form after submission
        form.remove();
        scoreDisplay.remove();
        title.remove();
        //refresh leaderboard after submission
        //fetchLeaderboard();
      })
      .catch((error) => {
        console.error("Error submitting score:", error);
        alert("Error submitting score. Please try again.");
      });
  });
}

// Reset the game for a new round
function resetGame() {
  targetsHit = 0;
  targets.forEach((target) => {
    target.style.backgroundImage = `repeating-radial-gradient(circle, #ff3b30, #ff3b30 20px, #ffffff 20px, #ffffff 40px)`; // Reset color
    target.style.pointerEvents = "auto"; // Enable clicks
  });
  resetTimer();
}

//Retrieve leaderboard from backend and display it
function fetchLeaderboard() {
  fetch("/api/leaderboard/top") //top 10 scores
    .then((response) => response.json())
    .then((data) => {
      const leaderboard = data;
      const leaderboardTable = document.getElementById("leaderboard-body");
      leaderboardTable.innerHTML = ""; // Clear existing list

      leaderboard.forEach((entry, index) => {
        const tableRow = document.createElement("tr");
        const rankCell = document.createElement("td");
        const nameCell = document.createElement("td");
        const scoreCell = document.createElement("td");

        rankCell.textContent = index + 1;
        nameCell.textContent = entry.value;
        scoreCell.textContent = entry.score;

        tableRow.appendChild(rankCell);
        tableRow.appendChild(nameCell);
        tableRow.appendChild(scoreCell);

        leaderboardTable.appendChild(tableRow);
      });
    })
    .catch((error) => {
      console.error("Error fetching leaderboard:", error);
    });
}

// Fetch leaderboard on page load
window.addEventListener("load", fetchLeaderboard);
