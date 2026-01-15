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

    if (result == RoundResult.Win)
        state.PlayerWins++;
    else if (result == RoundResult.Lose)
        state.AiWins++;
    else if (result == RoundResult.Draw)
        state.Draws++;

    var resultString = result.ToString();

    return Results.Json(new 
    { 
        playerChoice = playerChoice.ToString(),
        aiChoice = aiChoice.ToString(),
        result = resultString,
        totalRounds = state.TotalRounds,
        playerWins = state.PlayerWins,
        aiWins = state.AiWins,
        draws = state.Draws
    });
});

/// <summary>
/// POST /game/reset
/// Resets the game state.
/// </summary>
app.MapPost("/game/reset", (GameState state) =>
{
    state.Reset();
    return Results.Json(new 
    { 
        totalRounds = 0,
        playerWins = 0,
        aiWins = 0,
        draws = 0
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
        totalRounds = state.TotalRounds,
        playerWins = state.PlayerWins,
        aiWins = state.AiWins,
        draws = state.Draws,
        difficulty = state.CurrentDifficulty.ToString(),
        theme = state.CurrentTheme.ToString()
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
