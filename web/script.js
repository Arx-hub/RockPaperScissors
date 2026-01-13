// RockPaperScissors with AI - Web Version

// AI Module
const aiStats = loadMoveStats();

function recordMove(move) {
    if (aiStats.hasOwnProperty(move)) {
        aiStats[move]++;
    }
}

function getAIMove() {
    const totalMoves = aiStats.rock + aiStats.paper + aiStats.scissors;
    if (totalMoves < 3) {
        const moves = ['rock', 'paper', 'scissors'];
        return moves[Math.floor(Math.random() * moves.length)];
    }

    let mostUsed = 'rock';
    let maxCount = aiStats.rock;
    if (aiStats.paper > maxCount) {
        mostUsed = 'paper';
        maxCount = aiStats.paper;
    }
    if (aiStats.scissors > maxCount) {
        mostUsed = 'scissors';
        maxCount = aiStats.scissors;
    }

    const counterMoves = {
        rock: 'paper',
        paper: 'scissors',
        scissors: 'rock'
    };
    return counterMoves[mostUsed];
}

// Utils Module
function determineWinner(playerMove, aiMove) {
    if (playerMove === aiMove) return 'tie';
    const winConditions = {
        rock: 'scissors',
        paper: 'rock',
        scissors: 'paper'
    };
    return winConditions[playerMove] === aiMove ? 'player' : 'ai';
}

function getResultMessage(result, playerMove, aiMove) {
    const moves = { rock: 'Rock', paper: 'Paper', scissors: 'Scissors' };
    switch (result) {
        case 'tie': return `It's a tie! Both chose ${moves[playerMove]}.`;
        case 'player': return `You win! ${moves[playerMove]} beats ${moves[aiMove]}.`;
        case 'ai': return `AI wins! ${moves[aiMove]} beats ${moves[playerMove]}.`;
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
        scissors: parsed.scissors || 0
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
    history.slice(-5).forEach(item => { // Show last 5
        const li = document.createElement('li');
        li.textContent = `You: ${item.player} | AI: ${item.ai} | Result: ${item.result}`;
        historyList.appendChild(li);
    });
}

// Main Game Logic
let stats = loadStats();
let history = loadHistory();

document.addEventListener('DOMContentLoaded', () => {
    console.log('Rock Paper Scissors script loaded successfully');
    updateStatsDisplay(stats);
    updateHistoryDisplay(history);

    // Button event listeners
    document.getElementById('rock').addEventListener('click', () => playRound('rock'));
    document.getElementById('paper').addEventListener('click', () => playRound('paper'));
    document.getElementById('scissors').addEventListener('click', () => playRound('scissors'));
    document.getElementById('resetStats').addEventListener('click', resetStats);
});

function playRound(playerMove) {
    console.log('Playing round with:', playerMove);
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
    document.getElementById('result').textContent = message;
    updateStatsDisplay(stats);
    updateHistoryDisplay(history);

    // Record move for AI
    recordMove(playerMove);
    saveMoveStats(aiStats);
}

function resetStats() {
    if (confirm('Reset all statistics?')) {
        stats = { playerWins: 0, aiWins: 0, ties: 0, totalGames: 0 };
        aiStats.rock = 0;
        aiStats.paper = 0;
        aiStats.scissors = 0;
        history = [];
        saveStats(stats);
        saveMoveStats(aiStats);
        saveHistory(history);
        updateStatsDisplay(stats);
        updateHistoryDisplay(history);
        document.getElementById('result').textContent = 'Statistics reset!';
    }
}