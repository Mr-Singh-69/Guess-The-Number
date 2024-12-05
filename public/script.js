const guessInput = document.getElementById('guessInput');
const submitGuessButton = document.getElementById('submitGuessButton');
const messageEl = document.getElementById('message');
const attemptsEl = document.getElementById('attempts');
const leaderboardEl = document.getElementById('leaderboard');

let attempts = 0;
let playerName = prompt('Enter your name:');

submitGuessButton.addEventListener('click', function () {
    const guess = parseInt(guessInput.value);
    
    if (isNaN(guess) || guess < 1 || guess > 100) {
        messageEl.textContent = 'Please enter a valid number between 1 and 100.';
        return;
    }

    // Make a POST request to the backend
    fetch('http://localhost:3000/guess', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guess, playerName }),
    })
        .then(response => response.json())
        .then(data => {
            messageEl.textContent = data.message;
            attempts = data.attempts;
            attemptsEl.textContent = attempts;
            if (data.correct) {
                getLeaderboard();  // Fetch and display the leaderboard after a correct guess
            }
        })
        .catch(error => {
            console.error('Error submitting guess:', error);
            messageEl.textContent = 'Error submitting guess. Please try again.';
        });
});

// Fetch and display the leaderboard
function getLeaderboard() {
    fetch('http://localhost:3000/leaderboard')
        .then(response => response.json())
        .then(leaderboard => {
            leaderboardEl.innerHTML = '';
            leaderboard.forEach(entry => {
                const li = document.createElement('li');
                li.textContent = `${entry.playerName} - ${entry.attempts} attempts`;
                leaderboardEl.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching leaderboard:', error));
}
