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
/// Enum for game mode.
/// </summary>
public enum GameMode
{
    Normal,    // Single round play
    Match      // Best of 5 rounds (need 3 wins to win match)
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
    public GameMode CurrentMode { get; set; } = GameMode.Normal;

    /// <summary>
    /// Stores the player's move history for AI prediction in Hard mode.
    /// </summary>
    public List<Choice> PlayerMoveHistory { get; set; } = new();

    /// <summary>
    /// Stores the AI's last choice (used in Normal mode for bias).
    /// </summary>
    public Choice? LastAiChoice { get; set; }

    /// <summary>
    /// Match mode state - tracks current match round number
    /// </summary>
    public int CurrentMatchRound { get; set; } = 0;

    /// <summary>
    /// Match mode state - tracks wins in current match (player)
    /// </summary>
    public int MatchPlayerWins { get; set; } = 0;

    /// <summary>
    /// Match mode state - tracks wins in current match (AI)
    /// </summary>
    public int MatchAiWins { get; set; } = 0;

    /// <summary>
    /// Match mode state - tracks draws in current match
    /// </summary>
    public int MatchDraws { get; set; } = 0;

    /// <summary>
    /// Tracks total match votes for player
    /// </summary>
    public int PlayerVotes { get; set; } = 0;

    /// <summary>
    /// Tracks total match votes for AI
    /// </summary>
    public int AiVotes { get; set; } = 0;

    /// <summary>
    /// Stores results of individual rounds in a match
    /// </summary>
    public List<(RoundResult result, Choice playerChoice, Choice aiChoice)> MatchRoundResults { get; set; } = new();

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

    /// <summary>
    /// Resets match state for a new match.
    /// </summary>
    public void ResetMatch()
    {
        CurrentMatchRound = 0;
        MatchPlayerWins = 0;
        MatchAiWins = 0;
        MatchDraws = 0;
        MatchRoundResults.Clear();
        PlayerVotes = 0;
        AiVotes = 0;
    }

    /// <summary>
    /// Checks if the match is complete.
    /// </summary>
    public bool IsMatchComplete()
    {
        return MatchPlayerWins >= 3 || MatchAiWins >= 3 || CurrentMatchRound >= 5;
    }
}
