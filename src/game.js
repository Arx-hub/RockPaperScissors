// Main game logic for RockPaperScissors
// This file handles user input, game loop, and integrates AI and utilities

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const { recordMove, getAIMove } = require('./ai');
const { determineWinner, getResultMessage } = require('./utils');

// Path to stats file
const statsFilePath = path.join(__dirname, '..', 'stats.json');

// Load statistics from file
function loadStats() {
    try {
        const data = fs.readFileSync(statsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist or is corrupted, return defaults
        return { playerWins: 0, aiWins: 0, ties: 0, totalGames: 0 };
    }
}

// Save statistics to file
function saveStats(stats) {
    try {
        fs.writeFileSync(statsFilePath, JSON.stringify(stats, null, 2));
    } catch (error) {
        console.error('Error saving stats:', error.message);
    }
}

// Global stats object
let stats = loadStats();

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to display current statistics
function displayStats() {
    console.log('\n--- Game Statistics ---');
    console.log(`Total games: ${stats.totalGames}`);
    console.log(`Player wins: ${stats.playerWins}`);
    console.log(`AI wins: ${stats.aiWins}`);
    console.log(`Ties: ${stats.ties}`);
    console.log('------------------------\n');
}

// Function to play a single round
function playRound(playerMove) {
    // Get AI move
    const aiMove = getAIMove();

    // Determine winner
    const result = determineWinner(playerMove, aiMove);

    // Update statistics
    stats.totalGames++;
    if (result === 'player') {
        stats.playerWins++;
    } else if (result === 'ai') {
        stats.aiWins++;
    } else {
        stats.ties++;
    }

    // Display moves and result
    console.log(`You chose: ${playerMove}`);
    console.log(`AI chose: ${aiMove}`);
    console.log(getResultMessage(result, playerMove, aiMove));

    // Record player's move for AI learning
    recordMove(playerMove);

    // Ask to play again
    askToPlayAgain();
}

// Function to prompt user for move
function askForMove() {
    rl.question('Choose rock, paper, or scissors (or "quit" to exit, "stats" to view statistics): ', (input) => {
        const move = input.toLowerCase().trim();

        if (move === 'quit') {
            saveStats(stats); // Save stats before exiting
            console.log('Thanks for playing!');
            rl.close();
            return;
        }

        if (move === 'stats') {
            displayStats();
            askForMove();
            return;
        }

        if (['rock', 'paper', 'scissors'].includes(move)) {
            playRound(move);
        } else {
            console.log('Invalid choice. Please choose rock, paper, or scissors.');
            askForMove();
        }
    });
}

// Function to ask if player wants to play again
function askToPlayAgain() {
    rl.question('Play again? (y/n): ', (answer) => {
        if (answer.toLowerCase().startsWith('y')) {
            askForMove();
        } else {
            saveStats(stats); // Save stats before exiting
            console.log('Thanks for playing!');
            rl.close();
        }
    });
}

// Start the game
console.log('Welcome to Rock-Paper-Scissors with AI!');
displayStats(); // Show initial stats
askForMove();