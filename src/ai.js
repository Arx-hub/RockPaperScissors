// AI module for RockPaperScissors game
// This module analyzes the player's previous moves and selects a counter strategy

// Object to store move statistics
const moveStats = {
    rock: 0,
    paper: 0,
    scissors: 0
};

// Function to record a player's move
function recordMove(move) {
    if (moveStats.hasOwnProperty(move)) {
        moveStats[move]++;
    }
}

// Function to get the AI's move based on analysis
function getAIMove() {
    // Calculate total moves
    const totalMoves = moveStats.rock + moveStats.paper + moveStats.scissors;

    // If not enough data, choose randomly
    if (totalMoves < 3) {
        const moves = ['rock', 'paper', 'scissors'];
        return moves[Math.floor(Math.random() * moves.length)];
    }

    // Find the most used move
    let mostUsed = 'rock';
    let maxCount = moveStats.rock;
    if (moveStats.paper > maxCount) {
        mostUsed = 'paper';
        maxCount = moveStats.paper;
    }
    if (moveStats.scissors > maxCount) {
        mostUsed = 'scissors';
        maxCount = moveStats.scissors;
    }

    // Choose counter move
    const counterMoves = {
        rock: 'paper',
        paper: 'scissors',
        scissors: 'rock'
    };

    return counterMoves[mostUsed];
}

// Export functions for use in other modules
module.exports = {
    recordMove,
    getAIMove
};