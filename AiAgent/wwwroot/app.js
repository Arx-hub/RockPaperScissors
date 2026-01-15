/**
 * Main game logic for Rock-Paper-Scissors vs AI
 * Handles UI interactions and API communication with the backend
 */

// Choice emoji mapping
const CHOICE_EMOJI = {
    'Rock': '✊',
    'Paper': '✋',
    'Scissors': '✌️'
};

// Initialize game on page load
document.addEventListener('DOMContentLoaded', () => {
    document.body.innerHTML = '<h1>DEBUG: DOMContentLoaded fired!</h1>' + document.body.innerHTML;
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
    const debugMsg = 'setupEventListeners called';
    console.log(debugMsg);
    
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

    // Theme toggle button
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const found = themeToggleBtn ? 'YES' : 'NO';
    console.log('Looking for theme-toggle-btn, found: ' + found);
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
        console.log('Theme button listener attached');
    } else {
        console.error('theme-toggle-btn not found!');
    }

    // Reset button
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetGame);
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
    } catch (error) {
        console.error('Error loading game state:', error);
    }
}

/**
 * Play a round with the selected choice
 * @param {string} choice - The player's choice (Rock, Paper, or Scissors)
 */
async function playRound(choice) {
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

        // Update scoreboard
        updateScoreboard(result);

        // Clear selection after a delay
        setTimeout(() => clearPlayerSelection(), 2000);
    } catch (error) {
        console.error('Error playing round:', error);
        displayError('Virhe: yhteydessä palvelimeen');
    }
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
    try {
        const response = await fetch('/game/reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error('Failed to reset game');

        const result = await response.json();
        updateScoreboard(result);
        clearPlayerSelection();

        // Hide result section
        document.getElementById('result-section').style.display = 'none';
    } catch (error) {
        console.error('Error resetting game:', error);
    }
}

/**
 * Toggle between pink and blue themes
 */
function toggleTheme() {
    console.log('toggleTheme called!');
    const body = document.body;
    const currentTheme = body.classList.contains('theme-blue') ? 'blue' : 'pink';
    const newTheme = currentTheme === 'blue' ? 'pink' : 'blue';
    console.log('Switching from', currentTheme, 'to', newTheme);

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

// Theme toggle and initialization
function toggleTheme(){
  const body = document.body;
  const current = body.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  body.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeButton(next);
}

function updateThemeButton(theme){
  const btn = document.getElementById('theme-toggle');
  if(!btn) return;
  btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Apply saved theme on load
document.addEventListener('DOMContentLoaded', ()=>{
  const saved = localStorage.getItem('theme') || 'light';
  document.body.setAttribute('data-theme', saved);
  updateThemeButton(saved);
});
