/**
 * Main game logic for Rock-Paper-Scissors vs AI
 * Handles UI interactions and API communication with the backend
 */

// Choice emoji mapping
const CHOICE_EMOJI = {
    'Rock': '✊',
    'Paper': '✋',
    'Scissors': '✌️',
    'Lizard': '🦎',
    'Spock': '🖖'
};

/**
 * Simple sound effects using Web Audio API
 * Creates beep sounds without needing audio files
 */
const SoundEffects = {
    audioContext: null,

    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    },

    playWinSound() {
        this.init();
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        // Win sound: ascending notes
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        osc.start(now);
        osc.stop(now + 0.3);
    },

    playLoseSound() {
        this.init();
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        // Lose sound: descending notes
        osc.frequency.setValueAtTime(783.99, now); // G5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(523.25, now + 0.2); // C5
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        osc.start(now);
        osc.stop(now + 0.3);
    },

    playDrawSound() {
        this.init();
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        // Draw sound: held note
        osc.frequency.setValueAtTime(659.25, now); // E5
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        osc.start(now);
        osc.stop(now + 0.2);
    },

    playClickSound() {
        this.init();
        const ctx = this.audioContext;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        // Click sound: short beep
        osc.frequency.setValueAtTime(1000, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

        osc.start(now);
        osc.stop(now + 0.05);
    }
};

// Initialize game on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
});

/**
 * Initialize the game UI and event listeners
 */
function initializeGame() {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('gameTheme') || 'pink';
    setTheme(savedTheme);

    // Setup event listeners first (before async operations)
    setupEventListeners();

    // Load initial game state
    loadGameState();
}

/**
 * Setup all event listeners for buttons
 */
function setupEventListeners() {
    // Choice buttons
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const choice = btn.getAttribute('data-choice');
            playRound(choice);
        });
    });

    // Difficulty buttons
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const difficulty = btn.getAttribute('data-difficulty');
            await setDifficulty(difficulty);
        });
    });

    // Game mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const mode = btn.getAttribute('data-mode');
            await setGameMode(mode);
        });
    });

    // Theme toggle button
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // Reset button
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetGame);
    }

    // Match end buttons
    const endMatchBtn = document.getElementById('end-match-btn');
    if (endMatchBtn) {
        endMatchBtn.addEventListener('click', endMatch);
    }

    // Voting buttons
    const votePlayerBtn = document.getElementById('vote-player-btn');
    const voteAiBtn = document.getElementById('vote-ai-btn');
    if (votePlayerBtn) {
        votePlayerBtn.addEventListener('click', voteForPlayer);
    }
    if (voteAiBtn) {
        voteAiBtn.addEventListener('click', voteForAi);
    }
}

/**
 * Load and display the current game state from the backend
 */
async function loadGameState() {
    try {
        const response = await fetch('/game/state');
        if (!response.ok) throw new Error('Failed to load game state');

        const state = await response.json();
        updateScoreboard(state);
        updateDifficultyUI(state.difficulty);
        updateGameModeUI(state.mode);
        updateMatchUI(state);
        updateVotingUI(state);
    } catch (error) {
        console.error('Error loading game state:', error);
    }
}

/**
 * Set the game mode (Normal or Match)
 */
async function setGameMode(mode) {
    if (mode === 'match') {
        try {
            const response = await fetch('/game/match/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) throw new Error('Failed to start match');

            const result = await response.json();
            updateGameModeUI('match');
            enableChoiceButtons();
            loadGameState();
        } catch (error) {
            console.error('Error starting match:', error);
        }
    } else {
        // Switch to normal mode
        try {
            const response = await fetch('/game/reset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) throw new Error('Failed to reset game');

            updateGameModeUI('normal');
            enableChoiceButtons();
            loadGameState();
        } catch (error) {
            console.error('Error switching to normal mode:', error);
        }
    }
}

/**
 * Update the game mode UI
 */
function updateGameModeUI(mode) {
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-mode') === mode) {
            btn.classList.add('active');
        }
    });

    const matchSection = document.getElementById('match-section');
    if (mode === 'match' && matchSection) {
        matchSection.style.display = 'block';
    } else if (matchSection) {
        matchSection.style.display = 'none';
    }
}

/**
 * Update match-specific UI
 */
function updateMatchUI(state) {
    if (state.mode !== 'match') return;

    const matchRoundEl = document.getElementById('match-round');
    const matchPlayerWinsEl = document.getElementById('match-player-wins');
    const matchAiWinsEl = document.getElementById('match-ai-wins');
    const matchStatusEl = document.getElementById('match-status');
    const endMatchBtn = document.getElementById('end-match-btn');

    if (matchRoundEl) matchRoundEl.textContent = state.matchRound || 0;
    if (matchPlayerWinsEl) matchPlayerWinsEl.textContent = state.matchPlayerWins || 0;
    if (matchAiWinsEl) matchAiWinsEl.textContent = state.matchAiWins || 0;

    if (state.matchComplete) {
        if (matchStatusEl) {
            if (state.matchPlayerWins >= 3) {
                matchStatusEl.textContent = '✨ Sinä voitit matsin! ✨';
                matchStatusEl.className = 'match-status match-win';
            } else if (state.matchAiWins >= 3) {
                matchStatusEl.textContent = '🤖 AI voitti matsin! 🤖';
                matchStatusEl.className = 'match-status match-lose';
            } else {
                matchStatusEl.textContent = '🏁 Matsi päättyi! 🏁';
                matchStatusEl.className = 'match-status match-draw';
            }
        }
        if (endMatchBtn) {
            endMatchBtn.style.display = 'block';
        }
        // Disable choice buttons when match is complete
        disableChoiceButtons();
    } else {
        if (matchStatusEl) {
            matchStatusEl.textContent = `Kierros ${state.matchRound}/5`;
            matchStatusEl.className = 'match-status';
        }
        if (endMatchBtn) {
            endMatchBtn.style.display = 'none';
        }
        // Enable choice buttons during match
        enableChoiceButtons();
    }
}

/**
 * End the current match
 */
async function endMatch() {
    try {
        const response = await fetch('/game/match/end', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error('Failed to end match');

        const result = await response.json();
        
        // Reset voting when match ends
        await fetch('/game/vote/reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        updateGameModeUI('normal');
        loadGameState();
        clearPlayerSelection();
        document.getElementById('result-section').style.display = 'none';
    } catch (error) {
        console.error('Error ending match:', error);
    }
}

/**
 * Update voting UI
 */
function updateVotingUI(state) {
    const playerVotesEl = document.getElementById('player-votes');
    const aiVotesEl = document.getElementById('ai-votes');

    if (playerVotesEl) playerVotesEl.textContent = state.playerVotes || 0;
    if (aiVotesEl) aiVotesEl.textContent = state.aiVotes || 0;
}

/**
 * Vote for player winning the match
 */
async function voteForPlayer() {
    SoundEffects.playClickSound();
    try {
        const response = await fetch('/game/vote/player', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error('Failed to vote for player');

        const result = await response.json();
        updateVotingUI(result);
    } catch (error) {
        console.error('Error voting for player:', error);
    }
}

/**
 * Vote for AI winning the match
 */
async function voteForAi() {
    SoundEffects.playClickSound();
    try {
        const response = await fetch('/game/vote/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error('Failed to vote for AI');

        const result = await response.json();
        updateVotingUI(result);
    } catch (error) {
        console.error('Error voting for AI:', error);
    }
}

/**
 * Play a round with the selected choice
 * @param {string} choice - The player's choice (Rock, Paper, or Scissors)
 */
async function playRound(choice) {
    // Play click sound
    SoundEffects.playClickSound();

    // Clear any previous selection
    clearPlayerSelection();

    // Highlight selected choice
    const choiceBtn = document.getElementById(`choice-${choice.toLowerCase()}`);
    if (choiceBtn) {
        choiceBtn.classList.add('active');
    }

    try {
        // Send the player's choice to the backend
        const response = await fetch('/game/play', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playerChoice: choice })
        });

        if (!response.ok) throw new Error('Failed to play round');

        const result = await response.json();

        // Display the result
        displayResult(result);

        // Play sound based on result
        if (result.result === 'Win') {
            SoundEffects.playWinSound();
        } else if (result.result === 'Lose') {
            SoundEffects.playLoseSound();
        } else if (result.result === 'Draw') {
            SoundEffects.playDrawSound();
        }

        // Update scoreboard
        updateScoreboard(result);

        // Update match UI if in match mode
        if (result.mode === 'match') {
            updateMatchUI(result);
        }

        // Clear selection after a delay
        setTimeout(() => clearPlayerSelection(), 2000);
    } catch (error) {
        console.error('Error playing round:', error);
        displayError('Virhe: yhteydessä palvelimeen');
    }
}

/**
 * Disable choice buttons during match completion
 */
function disableChoiceButtons() {
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
    });
}

/**
 * Enable choice buttons during match
 */
function enableChoiceButtons() {
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
    });
}

/**
 * Display the round result with emojis and message
 * @param {object} result - The result object from the backend
 */
function displayResult(result) {
    const resultSection = document.getElementById('result-section');
    const playerEmojiEl = document.getElementById('player-choice-emoji');
    const aiEmojiEl = document.getElementById('ai-choice-emoji');
    const resultMessageEl = document.getElementById('result-message');

    // Update emojis
    playerEmojiEl.textContent = CHOICE_EMOJI[result.playerChoice] || '?';
    aiEmojiEl.textContent = CHOICE_EMOJI[result.aiChoice] || '?';

    // Create result message
    let resultText = '';
    let resultClass = '';

    if (result.result === 'Win') {
        resultText = '🎉 Voitit tämän kierroksen!';
        resultClass = 'result-win';
    } else if (result.result === 'Lose') {
        resultText = '😔 AI voitti tämän kierroksen';
        resultClass = 'result-lose';
    } else if (result.result === 'Draw') {
        resultText = '🤝 Tasapeli!';
        resultClass = 'result-draw';
    }

    // Add match round info if in match mode
    if (result.mode === 'match') {
        resultText += ` (Kierros ${result.matchRound}/5)`;
    }

    resultMessageEl.textContent = resultText;
    resultMessageEl.className = `result-message ${resultClass}`;

    // Show result section
    resultSection.style.display = 'block';
}

/**
 * Display an error message
 * @param {string} message - The error message to display
 */
function displayError(message) {
    const resultSection = document.getElementById('result-section');
    const resultMessageEl = document.getElementById('result-message');

    resultMessageEl.textContent = message;
    resultMessageEl.className = 'result-message result-lose';
    resultSection.style.display = 'block';
}

/**
 * Update the scoreboard display
 * @param {object} state - The game state with score information
 */
function updateScoreboard(state) {
    document.getElementById('score-rounds').textContent = state.totalRounds || 0;
    document.getElementById('score-wins').textContent = state.playerWins || 0;
    document.getElementById('score-ai-wins').textContent = state.aiWins || 0;
    document.getElementById('score-draws').textContent = state.draws || 0;
}

/**
 * Update the difficulty button UI
 * @param {string} difficulty - The current difficulty level
 */
function updateDifficultyUI(difficulty) {
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-difficulty') === difficulty) {
            btn.classList.add('active');
        }
    });
    
    // Hide Lizard and Spock for Normal (Helppo) and Hard (Vaikea) difficulties
    const lizardBtn = document.getElementById('choice-lizard');
    const spockBtn = document.getElementById('choice-spock');
    
    if (difficulty === 'Normal' || difficulty === 'Hard') {
        if (lizardBtn) lizardBtn.style.display = 'none';
        if (spockBtn) spockBtn.style.display = 'none';
    } else {
        if (lizardBtn) lizardBtn.style.display = 'block';
        if (spockBtn) spockBtn.style.display = 'block';
    }
}

/**
 * Set the game difficulty
 * @param {string} difficulty - The difficulty level (Normal or Hard)
 */
async function setDifficulty(difficulty) {
    try {
        const response = await fetch('/game/difficulty', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ difficulty: difficulty })
        });

        if (!response.ok) throw new Error('Failed to set difficulty');

        updateDifficultyUI(difficulty);
    } catch (error) {
        console.error('Error setting difficulty:', error);
    }
}

/**
 * Reset the game to initial state
 */
async function resetGame() {
    SoundEffects.playClickSound();
    try {
        const response = await fetch('/game/reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error('Failed to reset game');

        const result = await response.json();
        updateScoreboard(result);
        clearPlayerSelection();
        enableChoiceButtons();

        // Hide result section
        document.getElementById('result-section').style.display = 'none';

        // Reset voting
        await fetch('/game/vote/reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        loadGameState();
    } catch (error) {
        console.error('Error resetting game:', error);
    }
}

/**
 * Toggle between pink and blue themes
 */
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.classList.contains('theme-blue') ? 'blue' : 'pink';
    const newTheme = currentTheme === 'blue' ? 'pink' : 'blue';

    setTheme(newTheme);

    // Save theme preference to localStorage
    localStorage.setItem('gameTheme', newTheme);
}

/**
 * Set the game theme
 * @param {string} theme - The theme to set (pink or blue)
 */
function setTheme(theme) {
    const body = document.body;
    
    // Normalize theme to lowercase
    const normalizedTheme = (theme || 'pink').toLowerCase();

    // Remove both theme classes
    body.classList.remove('theme-pink', 'theme-blue');

    // Add the new theme class
    if (normalizedTheme === 'blue') {
        body.classList.add('theme-blue');
        const btn = document.getElementById('theme-toggle-btn');
        if (btn) {
            btn.textContent = '🌅 Vaihda vaaleanpunaiseen';
        }
    } else {
        body.classList.add('theme-pink');
        const btn = document.getElementById('theme-toggle-btn');
        if (btn) {
            btn.textContent = '🌙 Vaihda siniseen';
        }
    }

    // Notify backend of theme change
    fetch('/game/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: normalizedTheme })
    }).catch(err => console.error('Error updating theme on server:', err));
}

/**
 * Clear the active selection from all choice buttons
 */
function clearPlayerSelection() {
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.classList.remove('active');
    });
}


