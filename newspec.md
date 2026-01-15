# documentation for an AI agent

## Project overview

Create a simple **Rock–Paper–Scissors** web game where the player plays against an AI opponent.

- **Language:** C#
- **Target:** Web (browser-based UI)
- **Environment:** Visual Studio Code
- **Output:** A runnable web app plus this `README.md` as documentation.

You may use any suitable C# web stack (e.g. ASP.NET Core with Razor Pages, MVC, or Blazor Server/WebAssembly). Prefer the simplest setup that runs in a browser and allows basic interactivity without page reloads.

---

## Functional requirements

- **Core game:**
  - **Player choice:** Rock, Paper, or Scissors, shown as **hand emojis**:
    - ✊ (rock), ✋ (paper), ✌️ (scissors)
  - **AI choice:** Same three options, also displayed as emojis.
  - **Result display:** After each round, show:
    - Player choice
    - AI choice
    - Round result: *Win*, *Lose*, or *Draw*

- **Score tracking:**
  - Track **total rounds played**.
  - Track **player wins**.
  - Optionally track **AI wins** and **draws** (if helpful for UI).
  - Add a **Reset** button that:
    - Sets all counters back to zero.
    - Clears any current round result display (optional but preferred).

- **Difficulty levels:**
  - Provide a **difficulty selector** with at least two options:
    - **Normal**
    - **Hard**
  - The selected difficulty must affect how the AI chooses its move.

- **Theme switching:**
  - Add a **button at the top-left corner** of the page to toggle color theme.
  - Two themes:
    - **Pastel pink** theme
    - **Darker blue** theme
  - The theme affects at least:
    - Page background
    - Main text and button colors
  - The button should clearly indicate the current or next theme (e.g. “Switch to Blue Theme” / “Switch to Pink Theme”).

- **Extensibility:**
  - Animations and sounds are **not implemented now**, but the structure should make it easy to add them later (e.g. clear separation of game logic and UI).

---

## Non-functional requirements

- **Clean structure:** Separate game logic from UI as much as reasonably possible.
- **Readable code:** Use clear method and variable names, and add brief comments where logic is non-trivial.
- **Single-page interaction:** The game should be playable without full page reloads (e.g. via Blazor components or minimal JavaScript interop if needed).

---

## Suggested project structure

You may adapt this structure to the chosen C# web framework, but keep the roles similar.

- **Solution / project:**
  - `RockPaperScissors.Web/`
    - `Program.cs` / `Startup.cs` (or equivalent) – app bootstrap
    - `Pages/` or `Components/` (depending on framework)
      - `Index.razor` or `Index.cshtml` – main game UI
    - `Game/`
      - `GameState.cs` – holds scores, current round info, difficulty, theme
      - `GameLogic.cs` – contains logic for:
        - Determining round result
        - AI move selection for each difficulty
    - `wwwroot/`
      - `css/site.css` – theme styles
    - `README.md` – this documentation

---

## UI layout requirements

Design a simple, clear layout:

- **Top bar:**
  - **Left:** Theme toggle button (pastel pink ↔ darker blue).
  - **Right or center:** Game title, e.g. “Rock–Paper–Scissors vs AI”.

- **Main area:**
  - **Difficulty selector:**
    - Radio buttons, dropdown, or toggle for **Normal** and **Hard**.
  - **Player controls:**
    - Three buttons with emojis:
      - ✊ Rock
      - ✋ Paper
      - ✌️ Scissors
  - **Round result display:**
    - Show:
      - “You chose: [emoji]”
      - “AI chose: [emoji]”
      - “Result: You [Win/Lose/Draw]”
  - **Scoreboard:**
    - “Rounds played: X”
    - “Your wins: Y”
    - Optionally “AI wins: Z”, “Draws: W”
  - **Reset button:**
    - Resets all scores and clears current round state.

---

## Game logic details

### Choices

Define an enum or similar structure:

- `Rock`
- `Paper`
- `Scissors`

Map them to emojis for display:

- Rock → ✊  
- Paper → ✋  
- Scissors → ✌️  

### Determining the winner

Implement a method like:

- **Input:** `playerChoice`, `aiChoice`
- **Output:** `RoundResult` (e.g. `Win`, `Lose`, `Draw`)

Rules:

- Rock beats Scissors
- Scissors beats Paper
- Paper beats Rock
- Same choice → Draw

Update the game state:

- Increment total rounds.
- Increment player wins / AI wins / draws based on result.

---

## Difficulty behavior

### Normal difficulty

**Goal:** AI makes more of the same choices, i.e. it is somewhat predictable.

One simple approach:

- Maintain a small bias toward repeating its **previous move**.
- Example:
  - 60% chance: repeat last AI move.
  - 40% chance: random among the other two moves.
- On the very first round, choose randomly among all three.

Alternative acceptable behavior:

- AI randomly chooses, but with a fixed bias toward one symbol (e.g. Rock more often).
- However, the **preferred** behavior is to bias toward its own previous move.

### Hard difficulty

**Goal:** Make the AI “smarter” so it can **predict the next move**.

Implement a simple prediction strategy based on the player’s history:

- Track the player’s past moves in a list or counters.
- Use one of these strategies (pick one and implement consistently):

**Option A: Frequency-based prediction**

- Count how many times the player has chosen Rock, Paper, Scissors.
- Assume the player is more likely to choose their **most frequent** move again.
- Predict that move, then choose the **counter** to it:
  - If predicted Rock → AI chooses Paper.
  - If predicted Paper → AI chooses Scissors.
  - If predicted Scissors → AI chooses Rock.
- If counts are equal (e.g. early game), fall back to a random choice.

**Option B: Last-move prediction**

- Assume the player will repeat their **last move**.
- Choose the counter to the last move.
- On the first round, or if no history, choose randomly.

Either approach is acceptable as long as:

- It clearly differs from Normal mode.
- It uses some form of player history to influence AI choice.

Document in comments which strategy you implemented.

---

## Theme switching behavior

- Maintain a **theme state** (e.g. `CurrentTheme = Pink | Blue`).
- The theme toggle button:
  - On click, switches between the two themes.
  - Updates the UI immediately.

### Styling

In `site.css` (or equivalent):

- Define two theme classes, for example:
  - `.theme-pink` – pastel pink background, complementary text and button colors.
  - `.theme-blue` – darker blue background, complementary text and button colors.
- Apply the theme class to a top-level container (e.g. `<body>` or main `<div>`).
- Ensure sufficient contrast for readability in both themes.

---

## State management

- Keep game state (scores, difficulty, theme, last choices) in a central place:
  - For Blazor: a component-level state or a scoped service.
  - For Razor Pages/MVC: use a simple in-memory model for the session (no persistence required).
- On each round:
  - Read current difficulty and theme.
  - Use difficulty to compute AI move.
  - Compute result and update scores.
  - Re-render the UI with updated state.

- On reset:
  - Set all counters to zero.
  - Clear last choices and result text (optional but recommended).

---

## README content requirements

This `README.md` must include:

- The phrase **“documentation for an AI agent”** at the start (already done).
- A short explanation of:
  - What the project is.
  - How to run it.
  - How the difficulty and theme systems work.

Add a short “How to run” section once the project structure is known, for example:

- **For ASP.NET Core / Blazor:**
  - `dotnet restore`
  - `dotnet run`
  - Open the shown URL in a browser.

---

## Future extensions (not implemented now)

Leave clear places in the code (comments or methods) where these can be added later:

- **Animations:**
  - Button hover effects.
  - Simple transitions when showing results.
- **Sounds:**
  - Sound on button click.
  - Sound on win/lose/draw.

Do not implement them now—just keep the structure easy to extend.

---

## Acceptance checklist

The implementation is complete when:

- **Game runs in a browser** and is written in C#.
- Player can choose Rock/Paper/Scissors via **hand emojis**.
- AI chooses its move and the **result is displayed**.
- **Scores** (rounds played, player wins) are tracked and visible.
- **Reset button** clears scores and current round state.
- **Difficulty selector** exists and:
  - Normal: AI behavior is biased/repetitive.
  - Hard: AI uses player history to choose a counter move.
- **Theme toggle button** at top-left switches between pastel pink and darker blue themes.
- `README.md` contains this documentation and a brief “How to run” section.
