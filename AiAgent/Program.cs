using System.Text.Json.Serialization;
using RockPaperScissors.Game;

var builder = WebApplication.CreateBuilder(args);

// Add GameState and GameLogic as singletons
builder.Services.AddSingleton<GameState>();
builder.Services.AddSingleton<GameLogic>();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

/// <summary>
/// POST /game/play
/// Endpoint to play a round. Accepts player choice, returns AI choice and result.
/// Handles both normal single rounds and match mode rounds.
/// </summary>
app.MapPost("/game/play", (GameRequest req, GameState state, GameLogic logic) =>
{
    // Parse player choice
    if (!Enum.TryParse<Choice>(req.PlayerChoice, ignoreCase: true, out var playerChoice))
        return Results.BadRequest(new { error = "Virheellinen valinta" });

    // Get AI move based on difficulty
    var aiChoice = logic.GetAiMove(state);

    // Determine winner
    var result = logic.DetermineWinner(playerChoice, aiChoice);

    // Update game state
    state.LastAiChoice = aiChoice;
    state.PlayerMoveHistory.Add(playerChoice);
    state.TotalRounds++;

    if (state.CurrentMode == GameMode.Match)
    {
        // Match mode: track match-specific stats
        state.CurrentMatchRound++;
        state.MatchRoundResults.Add((result, playerChoice, aiChoice));

        if (result == RoundResult.Win)
            state.MatchPlayerWins++;
        else if (result == RoundResult.Lose)
            state.MatchAiWins++;
        else if (result == RoundResult.Draw)
            state.MatchDraws++;

        // Also update overall stats
        if (result == RoundResult.Win)
            state.PlayerWins++;
        else if (result == RoundResult.Lose)
            state.AiWins++;
        else if (result == RoundResult.Draw)
            state.Draws++;

        return Results.Json(new
        {
            playerChoice = playerChoice.ToString(),
            aiChoice = aiChoice.ToString(),
            result = result.ToString(),
            mode = "match",
            matchRound = state.CurrentMatchRound,
            matchPlayerWins = state.MatchPlayerWins,
            matchAiWins = state.MatchAiWins,
            matchDraws = state.MatchDraws,
            matchComplete = state.IsMatchComplete(),
            totalRounds = state.TotalRounds,
            playerWins = state.PlayerWins,
            aiWins = state.AiWins,
            draws = state.Draws
        });
    }
    else
    {
        // Normal mode: single round play
        if (result == RoundResult.Win)
            state.PlayerWins++;
        else if (result == RoundResult.Lose)
            state.AiWins++;
        else if (result == RoundResult.Draw)
            state.Draws++;

        // Ensure match-specific counters are not affected
        state.CurrentMatchRound = 0;
        state.MatchPlayerWins = 0;
        state.MatchAiWins = 0;
        state.MatchDraws = 0;
        state.MatchRoundResults.Clear();

        return Results.Json(new
        {
            playerChoice = playerChoice.ToString(),
            aiChoice = aiChoice.ToString(),
            result = result.ToString(),
            mode = "normal",
            totalRounds = state.TotalRounds,
            playerWins = state.PlayerWins,
            aiWins = state.AiWins,
            draws = state.Draws
        });
    }
});

/// <summary>
/// POST /game/reset
/// Resets the game state.
/// </summary>
app.MapPost("/game/reset", (GameState state) =>
{
    state.Reset();
    state.ResetMatch();
    state.CurrentMode = GameMode.Normal; // Ensure mode resets to normal
    return Results.Json(new
    {
        totalRounds = 0,
        playerWins = 0,
        aiWins = 0,
        draws = 0,
        matchComplete = false,
        mode = "normal"
    });
});

/// <summary>
/// POST /game/match/start
/// Starts a new match (best of 5, need 3 wins to win match).
/// </summary>
app.MapPost("/game/match/start", (GameState state) =>
{
    state.CurrentMode = GameMode.Match;
    state.ResetMatch();
    return Results.Json(new
    {
        mode = "match",
        matchStarted = true,
        matchRound = 0
    });
});

/// <summary>
/// POST /game/match/end
/// Ends the current match.
/// </summary>
app.MapPost("/game/match/end", (GameState state) =>
{
    var matchWinner = state.MatchPlayerWins >= 3 ? "player" :
                      state.MatchAiWins >= 3 ? "ai" : "none";

    var response = new
    {
        matchComplete = true,
        winner = matchWinner,
        matchPlayerWins = state.MatchPlayerWins,
        matchAiWins = state.MatchAiWins,
        matchDraws = state.MatchDraws,
        rounds = state.MatchRoundResults.Select(r => new
        {
            result = r.result.ToString(),
            playerChoice = r.playerChoice.ToString(),
            aiChoice = r.aiChoice.ToString()
        })
    };

    state.CurrentMode = GameMode.Normal; // Reset mode to normal after match
    return Results.Json(response);
});

/// <summary>
/// POST /game/vote/player
/// Vote for the player winning the match.
/// </summary>
app.MapPost("/game/vote/player", (GameState state) =>
{
    state.PlayerVotes++;
    return Results.Json(new
    {
        playerVotes = state.PlayerVotes,
        aiVotes = state.AiVotes
    });
});

/// <summary>
/// POST /game/vote/ai
/// Vote for the AI winning the match.
/// </summary>
app.MapPost("/game/vote/ai", (GameState state) =>
{
    state.AiVotes++;
    return Results.Json(new
    {
        playerVotes = state.PlayerVotes,
        aiVotes = state.AiVotes
    });
});

/// <summary>
/// POST /game/vote/reset
/// Reset voting counts.
/// </summary>
app.MapPost("/game/vote/reset", (GameState state) =>
{
    state.PlayerVotes = 0;
    state.AiVotes = 0;
    return Results.Json(new
    {
        playerVotes = 0,
        aiVotes = 0
    });
});

/// <summary>
/// POST /game/difficulty
/// Sets the game difficulty.
/// </summary>
app.MapPost("/game/difficulty", (DifficultyRequest req, GameState state) =>
{
    if (!Enum.TryParse<Difficulty>(req.Difficulty, ignoreCase: true, out var difficulty))
        return Results.BadRequest(new { error = "Virheellinen vaikeusaste" });

    state.CurrentDifficulty = difficulty;
    return Results.Json(new { difficulty = difficulty.ToString() });
});

/// <summary>
/// POST /game/theme
/// Sets the game theme.
/// </summary>
app.MapPost("/game/theme", (ThemeRequest req, GameState state) =>
{
    if (!Enum.TryParse<Theme>(req.Theme, ignoreCase: true, out var theme))
        return Results.BadRequest(new { error = "Virheellinen teema" });

    state.CurrentTheme = theme;
    return Results.Json(new { theme = theme.ToString() });
});

/// <summary>
/// GET /game/state
/// Returns the current game state.
/// </summary>
app.MapGet("/game/state", (GameState state) =>
{
    return Results.Json(new
    {
        mode = state.CurrentMode.ToString(),
        totalRounds = state.TotalRounds,
        playerWins = state.PlayerWins,
        aiWins = state.AiWins,
        draws = state.Draws,
        matchRound = state.CurrentMatchRound,
        matchPlayerWins = state.MatchPlayerWins,
        matchAiWins = state.MatchAiWins,
        matchDraws = state.MatchDraws,
        matchComplete = state.IsMatchComplete(),
        difficulty = state.CurrentDifficulty.ToString(),
        theme = state.CurrentTheme.ToString(),
        playerVotes = state.PlayerVotes,
        aiVotes = state.AiVotes
    });
});

app.Run();

public class GameRequest
{
    [JsonPropertyName("playerChoice")]
    public string? PlayerChoice { get; set; }
}

public class DifficultyRequest
{
    [JsonPropertyName("difficulty")]
    public string? Difficulty { get; set; }
}

public class ThemeRequest
{
    [JsonPropertyName("theme")]
    public string? Theme { get; set; }
}
