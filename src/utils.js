// Utility functions for RockPaperScissors game

// Function to determine the winner of a round
function determineWinner(playerMove, aiMove) {
    if (playerMove === aiMove) {
        return 'tie';
    }

    const winConditions = {
        rock: 'scissors',
        paper: 'rock',
        scissors: 'paper'
    };

    if (winConditions[playerMove] === aiMove) {
        return 'player';
    } else {
        return 'ai';
    }
}

// Function to get a human-readable result message
function getResultMessage(result, playerMove, aiMove) {
    switch (result) {
        case 'tie':
            return `It's a tie! Both chose ${playerMove}.`;
        case 'player':
            return `You win! ${playerMove} beats ${aiMove}.`;
        case 'ai':
            return `AI wins! ${aiMove} beats ${playerMove}.`;
        default:
            return 'Unknown result.';
    }
}

// Export functions
module.exports = {
    determineWinner,
    getResultMessage
};