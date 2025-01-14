const guessInput = document.getElementById('guess-input');
const submitBtn = document.getElementById('submit-btn');
const resetBtn = document.getElementById('reset-btn');
const feedback = document.getElementById('feedback');
const leaderboardTable = document.getElementById('leaderboard');
const nameSection = document.getElementById('name-section');
const gameSection = document.getElementById('game-section');
const playerNameInput = document.getElementById('player-name');
const startBtn = document.getElementById('start-btn');
const pulse1 = document.getElementById('pulse1');
const pulse2 = document.getElementById('pulse2');
const pulse3 = document.getElementById('pulse3');
const pulse4 = document.getElementById('pulse4');

function startPulse(element) {
    element.style.animation = 'pulse 2s infinite';
}

function stopPulse(element) {
    element.style.animation = 'none';
}


let randomNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;
let playerName = '';

// Start the game
function startGame() {
  playerName = playerNameInput.value.trim();
  if (playerName === '') {
    feedback.textContent = 'Please enter a valid name!';
    stopPulse(pulse1);
    stopPulse(pulse2);
    stopPulse(pulse4);
    startPulse(pulse3);  // done
    return;
  }

  nameSection.classList.add('hidden');
  gameSection.classList.remove('hidden');
  feedback.textContent = '';
  resetBtn.classList.add('hidden');
  randomNumber = Math.floor(Math.random() * 100) + 1;
  attempts = 0;
}

// Handle guess submission
function handleGuess() {
  const guess = Number(guessInput.value);
  attempts++;

  if (isNaN(guess) || guess < 1 || guess > 100) {
    feedback.textContent = 'Huh? Please enter a number between 1 and 100!';
    stopPulse(pulse1);
    stopPulse(pulse2);
    stopPulse(pulse4);
    startPulse(pulse3);  
    return;
  }

  if (guess === randomNumber) {
    feedback.textContent = `Congratulations, ${playerName}! You guessed it in ${attempts} attempts.`;
    stopPulse(pulse2);
    stopPulse(pulse3);
    stopPulse(pulse4);
    startPulse(pulse1);   
    submitBtn.disabled = true;
    guessInput.disabled = true;
    resetBtn.classList.remove('hidden');
    updateLeaderboard(attempts);
  } else if (guess < randomNumber) {
    feedback.textContent = 'Too low! Try again.';
    stopPulse(pulse1);
    stopPulse(pulse2);
    stopPulse(pulse3);
    startPulse(pulse4);  
  } else {
    feedback.textContent = 'Too high! Try again.';
    stopPulse(pulse1);
    stopPulse(pulse3);
    stopPulse(pulse4);
    startPulse(pulse2);  
  }

  guessInput.value = '';
}

function resetGame() {
  randomNumber = Math.floor(Math.random() * 100) + 1;
  attempts = 0;
  feedback.textContent = '';
  stopPulse(pulse1);
  stopPulse(pulse2);
  stopPulse(pulse3);
  stopPulse(pulse4);  
  guessInput.value = '';
  submitBtn.disabled = false;
  guessInput.disabled = false;
  resetBtn.classList.add('hidden');
}

function updateLeaderboard(score) {
  const newRow = leaderboardTable.insertRow();
  const rankCell = newRow.insertCell(0);
  const playerCell = newRow.insertCell(1);
  const scoreCell = newRow.insertCell(2);

  rankCell.textContent = leaderboardTable.rows.length;
  playerCell.textContent = playerName;
  scoreCell.textContent = score;
}

guessInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    handleGuess();
  }
});

submitBtn.addEventListener('click', handleGuess);
resetBtn.addEventListener('click', resetGame);
startBtn.addEventListener('click', startGame);
