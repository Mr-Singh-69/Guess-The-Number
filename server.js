const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());  // Enable CORS for the frontend to talk to the backend
app.use(bodyParser.json());
app.use(express.static('public'));

// Game Variables
let secretNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;
const leaderboardFile = 'leaderboard.json';

// Initialize leaderboard file if it doesn't exist
if (!fs.existsSync(leaderboardFile)) {
  fs.writeFileSync(leaderboardFile, JSON.stringify([]));
}

// Endpoint to handle guesses
app.post('/guess', (req, res) => {
  console.log('Received request:', req.body); // Log incoming request data
  const { guess, playerName } = req.body;
  attempts++;

  if (guess < secretNumber) {
    console.log('Guess too low');
    return res.json({ message: 'Too low!', correct: false, attempts });
  } else if (guess > secretNumber) {
    console.log('Guess too high');
    return res.json({ message: 'Too high!', correct: false, attempts });
  } else {
    console.log('Correct guess');
    const result = { message: 'Correct! 🎉', correct: true, attempts };
    const leaderboard = JSON.parse(fs.readFileSync(leaderboardFile));
    leaderboard.push({ playerName, attempts });
    leaderboard.sort((a, b) => a.attempts - b.attempts);
    fs.writeFileSync(leaderboardFile, JSON.stringify(leaderboard));
    secretNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    return res.json(result);
  }
});

// Endpoint to get leaderboard
app.get('/leaderboard', (req, res) => {
  const leaderboard = JSON.parse(fs.readFileSync(leaderboardFile));
  res.json(leaderboard);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
