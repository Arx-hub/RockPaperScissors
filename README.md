# RockPaperScissors with AI

## Project Purpose

This project is a console-based RockPaperScissors game implemented in JavaScript (Node.js) with an adaptive AI opponent. It also includes a web-based version for better user interface. The main goal is to practice using AI agents in IDEs, specifically GitHub Copilot in VS Code, for code generation, documentation, and project structuring.

The game features:
- Interactive gameplay via command line or web browser
- AI that learns from player's previous moves
- Persistent statistics tracking across sessions (JSON file for console, localStorage for web)
- Modular code structure for maintainability
- Comprehensive documentation
- Game history display

## How to Run the Game

### Prerequisites
- Node.js installed on your system

### Installation
1. Clone or navigate to the project directory.
2. Run `npm install` to install dependencies (if any).

### Running the Game

#### Console Version
Execute the following command in the terminal:
```
node src/game.js
```

Follow the prompts to play rounds. Type 'quit' to exit, 'stats' to view current statistics, or choose y/n to play again. Statistics are automatically saved and loaded between sessions.

#### Web Version
To run the web version with full functionality (including localStorage persistence), start a local server:
```
cd web
node server.js
```
Then open http://localhost:3000 in your browser.

Alternatively, open `web/index.html` directly in the browser (localStorage may not work in some browsers for local files).

## File Structure

```
rock-paper-scissors/
├── src/
│   ├── game.js      # Main game logic and user interface (console version)
│   ├── ai.js        # AI module for move analysis and selection
│   └── utils.js     # Utility functions for game mechanics
├── web/
│   ├── index.html   # Web version HTML page
│   ├── style.css    # Web version styling
│   └── script.js    # Web version JavaScript logic
├── stats.json       # Persistent game statistics (console version)
├── README.md        # Project documentation
└── .gitignore       # Git ignore rules
```

- **game.js**: Handles user input, game loop, and coordinates between AI and utilities.
- **ai.js**: Implements adaptive AI that tracks player statistics and chooses counter-moves.
- **utils.js**: Contains helper functions for determining winners and formatting results.

## AI Logic

The AI opponent analyzes the player's move history to predict and counter future moves:

1. **Statistics Tracking**: Records each player move (rock, paper, scissors).
2. **Adaptive Strategy**: After sufficient data (3+ moves), identifies the most frequent player move.
3. **Counter Selection**: Chooses the move that beats the predicted player choice.
4. **Random Fallback**: Uses random selection when data is insufficient.

This creates a challenging opponent that adapts to player patterns.

## How GitHub Copilot Was Used in This Project

GitHub Copilot (via Copilot Chat in VS Code) was instrumental in developing this project:

- **Code Generation**: Generated initial function structures, logic for AI analysis, and utility functions.
- **Documentation**: Assisted in writing comments, README sections, and explaining complex logic.
- **Project Structure**: Helped organize modular files and suggested best practices.
- **Debugging**: Provided suggestions for error handling and code improvements.
- **Refactoring**: Recommended optimizations for readability and performance.

The agent was prompted with detailed instructions to create/update specific files while preserving existing project elements like .gitignore.
