// RockPaperScissors with AI - Web Version

// AI Module
const aiStats = loadMoveStats();

// Global variables
let stats;
let history;
let isPlaying = false;

function recordMove(move) {
    if (aiStats.hasOwnProperty(move)) {
        aiStats[move]++;
    }
}

function getAIMove() {
    const difficulty = localStorage.getItem('difficulty') || 'easy';
    const moves = difficulty === 'hard' ? ['rock', 'paper', 'scissors', 'lizard', 'spock'] : ['rock', 'paper', 'scissors'];
    const totalMoves = moves.reduce((sum, move) => sum + aiStats[move], 0);
    if (totalMoves < 3) {
        return moves[Math.floor(Math.random() * moves.length)];
    }

    let mostUsed = 'rock';
    let maxCount = aiStats.rock;
    for (const move of moves) {
        if (aiStats[move] > maxCount) {
            mostUsed = move;
            maxCount = aiStats[move];
        }
    }

    const counterMoves = {
        rock: 'paper',
        paper: 'scissors',
        scissors: 'rock',
        lizard: 'scissors', // lizard loses to scissors
        spock: 'paper' // spock loses to paper
    };
    return counterMoves[mostUsed];
}

// Utils Module
function determineWinner(playerMove, aiMove) {
    if (playerMove === aiMove) return 'tie';
    const winConditions = {
        rock: ['scissors', 'lizard'],
        paper: ['rock', 'spock'],
        scissors: ['paper', 'lizard'],
        lizard: ['spock', 'paper'],
        spock: ['scissors', 'rock']
    };
    return winConditions[playerMove].includes(aiMove) ? 'player' : 'ai';
}

function getResultMessage(result, playerMove, aiMove) {
    switch (result) {
        case 'tie': return `It's a tie!`;
        case 'player': return `You won!`;
        case 'ai': return `Not this time`;
        default: return 'Unknown result.';
    }
}

// Stats Management
function loadStats() {
    const stats = localStorage.getItem('rpsStats');
    return stats ? JSON.parse(stats) : { playerWins: 0, aiWins: 0, ties: 0, totalGames: 0 };
}

function saveStats(stats) {
    localStorage.setItem('rpsStats', JSON.stringify(stats));
}

function loadMoveStats() {
    const data = localStorage.getItem('rpsMoveStats');
    const parsed = data ? JSON.parse(data) : {};
    return {
        rock: parsed.rock || 0,
        paper: parsed.paper || 0,
        scissors: parsed.scissors || 0,
        lizard: parsed.lizard || 0,
        spock: parsed.spock || 0
    };
}

function saveMoveStats(aiStats) {
    localStorage.setItem('rpsMoveStats', JSON.stringify(aiStats));
}

function updateStatsDisplay(stats) {
    document.getElementById('totalGames').textContent = stats.totalGames;
    document.getElementById('playerWins').textContent = stats.playerWins;
    document.getElementById('aiWins').textContent = stats.aiWins;
    document.getElementById('ties').textContent = stats.ties;
}

// History Management
function loadHistory() {
    const history = localStorage.getItem('rpsHistory');
    return history ? JSON.parse(history) : [];
}

function saveHistory(history) {
    localStorage.setItem('rpsHistory', JSON.stringify(history.slice(-10))); // Keep last 10
}

function updateHistoryDisplay(history) {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    history.slice(-3).forEach(item => { // Show last 3
        const li = document.createElement('li');
        li.textContent = `You: ${item.player} | AI: ${item.ai} | Result: ${item.result}`;
        historyList.appendChild(li);
    });
}

// Main Game Logic

document.addEventListener('DOMContentLoaded', () => {
    console.log('Rock Paper Scissors script loaded successfully');
    stats = loadStats();
    history = loadHistory();
    updateStatsDisplay(stats);
    updateHistoryDisplay(history);

    // Button event listeners
    document.getElementById('rock').addEventListener('click', () => playRound('rock'));
    document.getElementById('paper').addEventListener('click', () => playRound('paper'));
    document.getElementById('scissors').addEventListener('click', () => playRound('scissors'));
    document.getElementById('resetStats').addEventListener('click', resetStats);
});

function playRound(playerMove) {
    if (isPlaying) return;
    isPlaying = true;
    console.log('playRound called with:', playerMove);
    const aiMove = getAIMove();
    const result = determineWinner(playerMove, aiMove);
    const message = getResultMessage(result, playerMove, aiMove);

    // Update stats
    stats.totalGames++;
    if (result === 'player') stats.playerWins++;
    else if (result === 'ai') stats.aiWins++;
    else stats.ties++;

    // Update history
    history.push({ player: playerMove, ai: aiMove, result: result });

    // Save to localStorage
    saveStats(stats);
    saveHistory(history);

    // Update UI
    const moves = { 
        rock: 'Rock ✊', 
        paper: 'Paper ✋', 
        scissors: 'Scissors ✌️',
        lizard: 'Lizard 🦎',
        spock: 'Spock 🖖'
    };
    document.getElementById('playerChoice').textContent = `Your choice: ${moves[playerMove]}`;
    document.getElementById('aiChoice').textContent = `AI choice: ${moves[aiMove]}`;
    document.getElementById('result').textContent = message;
    document.getElementById('result').className = `result ${result}`;
    updateStatsDisplay(stats);
    updateHistoryDisplay(history);

    // Record move for AI
    recordMove(playerMove);
    saveMoveStats(aiStats);

    isPlaying = false;
}

function resetStats() {
    if (confirm('Reset all statistics?')) {
        stats = { playerWins: 0, aiWins: 0, ties: 0, totalGames: 0 };
        aiStats.rock = 0;
        aiStats.paper = 0;
        aiStats.scissors = 0;
        aiStats.lizard = 0;
        aiStats.spock = 0;
        history = [];
        saveStats(stats);
        saveMoveStats(aiStats);
        saveHistory(history);
        updateStatsDisplay(stats);
        updateHistoryDisplay(history);
        document.getElementById('playerChoice').textContent = 'Your choice: ';
        document.getElementById('aiChoice').textContent = 'AI choice: ';
        document.getElementById('result').textContent = 'Statistics reset!';
    }
}

function updateDifficultyUI(difficulty) {
    const hardButtons = document.querySelectorAll('.hard-only');
    hardButtons.forEach(btn => {
        btn.style.visibility = difficulty === 'hard' ? 'visible' : 'hidden';
    });
}

function changeDifficulty() {
    const select = document.getElementById('difficulty');
    const difficulty = select.value;
    localStorage.setItem('difficulty', difficulty);
    updateDifficultyUI(difficulty);
    console.log('Difficulty changed to:', difficulty);
}

function updateThemeButtonText(isLight) {
    const button = document.getElementById('toggleTheme');
    button.textContent = isLight ? 'Dark' : 'Light';
}

// Theme Toggle
function toggleTheme() {
    console.log('Toggle theme clicked');
    const body = document.body;
    const wasLight = body.classList.contains('light-theme');
    body.classList.toggle('light-theme');
    const isLight = body.classList.contains('light-theme');
    console.log('Theme toggled from', wasLight ? 'light' : 'dark', 'to', isLight ? 'light' : 'dark');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    updateThemeButtonText(isLight);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Rock Paper Scissors script loaded successfully');
    stats = loadStats();
    history = loadHistory();
    updateStatsDisplay(stats);
    updateHistoryDisplay(history);

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        console.log('Loaded light theme from localStorage');
        updateThemeButtonText(true);
    } else {
        console.log('Loaded dark theme from localStorage');
        updateThemeButtonText(false);
    }

    // Load saved difficulty
    const savedDifficulty = localStorage.getItem('difficulty') || 'easy';
    document.getElementById('difficulty').value = savedDifficulty;
    updateDifficultyUI(savedDifficulty);

    // Button event listeners
    document.getElementById('rock').addEventListener('click', (e) => { e.preventDefault(); console.log('rock clicked'); playRound('rock'); });
    document.getElementById('paper').addEventListener('click', (e) => { e.preventDefault(); console.log('paper clicked'); playRound('paper'); });
    document.getElementById('scissors').addEventListener('click', (e) => { e.preventDefault(); console.log('scissors clicked'); playRound('scissors'); });
    document.getElementById('lizard').addEventListener('click', (e) => { e.preventDefault(); console.log('lizard clicked'); playRound('lizard'); });
    document.getElementById('spock').addEventListener('click', (e) => { e.preventDefault(); console.log('spock clicked'); playRound('spock'); });
    document.getElementById('resetStats').addEventListener('click', resetStats);
    document.getElementById('toggleTheme').addEventListener('click', toggleTheme);
    document.getElementById('difficulty').addEventListener('change', changeDifficulty);
});