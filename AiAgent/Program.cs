using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapPost("/play", (GameRequest req) =>
{
    var choices = new[] { "kivi", "paperi", "sakset" };
    var rnd = new Random();
    var aiChoice = choices[rnd.Next(choices.Length)];
    var result = DetermineWinner(req.PlayerChoice?.ToLowerInvariant(), aiChoice);
    return Results.Json(new { aiChoice, result });
});

app.Run();

static string DetermineWinner(string? playerChoice, string aiChoice)
{
    if (string.IsNullOrWhiteSpace(playerChoice)) return "Virhe: ei valintaa";
    if (playerChoice == aiChoice) return "Tasapeli!";
    if ((playerChoice == "kivi" && aiChoice == "sakset") ||
        (playerChoice == "paperi" && aiChoice == "kivi") ||
        (playerChoice == "sakset" && aiChoice == "paperi"))
        return "Voitit!";
    return "Hävisit!";
}

public class GameRequest
{
    [JsonPropertyName("playerChoice")]
    public string? PlayerChoice { get; set; }
}
