namespace RockPaperScissors.Game;

/// <summary>
/// Enum for the three possible game choices.
/// </summary>
public enum Choice
{
    Rock,
    Paper,
    Scissors
}

/// <summary>
/// Enum for round result.
/// </summary>
public enum RoundResult
{
    Win,
    Lose,
    Draw
}

/// <summary>
/// Enum for game difficulty.
/// </summary>
public enum Difficulty
{
    Normal,
    Hard
}

/// <summary>
/// Enum for theme.
/// </summary>
public enum Theme
{
    Pink,
    Blue
}

/// <summary>
/// Holds the game state including scores, difficulty, and theme.
/// </summary>
public class GameState
{
    public int TotalRounds { get; set; }
    public int PlayerWins { get; set; }
    public int AiWins { get; set; }
    public int Draws { get; set; }

    public Difficulty CurrentDifficulty { get; set; } = Difficulty.Normal;
    public Theme CurrentTheme { get; set; } = Theme.Pink;

    /// <summary>
    /// Stores the player's move history for AI prediction in Hard mode.
    /// </summary>
    public List<Choice> PlayerMoveHistory { get; set; } = new();

    /// <summary>
    /// Stores the AI's last choice (used in Normal mode for bias).
    /// </summary>
    public Choice? LastAiChoice { get; set; }

    /// <summary>
    /// Resets all scores and clears history.
    /// </summary>
    public void Reset()
    {
        TotalRounds = 0;
        PlayerWins = 0;
        AiWins = 0;
        Draws = 0;
        PlayerMoveHistory.Clear();
        LastAiChoice = null;
    }
}
