const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());  
app.use(bodyParser.json());
app.use(express.static('public'));

let secretNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;
const leaderboardFile = 'leaderboard.json';

if (!fs.existsSync(leaderboardFile)) {
  fs.writeFileSync(leaderboardFile, JSON.stringify([]));
}

app.post('/guess', (req, res) => {
  console.log('Received request:', req.body);
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

app.get('/leaderboard', (req, res) => {
  const leaderboard = JSON.parse(fs.readFileSync(leaderboardFile));
  res.json(leaderboard);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
