namespace RockPaperScissors.Game;

/// <summary>
/// Contains the core game logic for determining winners and AI move selection.
/// </summary>
public class GameLogic
{
    private readonly Random _random = new();

    /// <summary>
    /// Determines the result of a round given player and AI choices.
    /// </summary>
    public RoundResult DetermineWinner(Choice playerChoice, Choice aiChoice)
    {
        if (playerChoice == aiChoice)
            return RoundResult.Draw;

        // Rock beats Scissors
        if (playerChoice == Choice.Rock && aiChoice == Choice.Scissors)
            return RoundResult.Win;

        // Scissors beats Paper
        if (playerChoice == Choice.Scissors && aiChoice == Choice.Paper)
            return RoundResult.Win;

        // Paper beats Rock
        if (playerChoice == Choice.Paper && aiChoice == Choice.Rock)
            return RoundResult.Win;

        return RoundResult.Lose;
    }

    /// <summary>
    /// Generates AI move based on the current difficulty level.
    /// Normal: Biased toward repeating its previous move (60% repeat, 40% random).
    /// Hard: Uses frequency-based prediction of player's most common move and counters it.
    /// </summary>
    public Choice GetAiMove(GameState state)
    {
        return state.CurrentDifficulty switch
        {
            Difficulty.Normal => GetAiMoveNormal(state),
            Difficulty.Hard => GetAiMoveHard(state),
            _ => GetRandomChoice()
        };
    }

    /// <summary>
    /// Normal difficulty: AI biases toward repeating its last move.
    /// First round: random choice.
    /// After first: 60% chance to repeat, 40% chance to pick a random alternative.
    /// </summary>
    private Choice GetAiMoveNormal(GameState state)
    {
        // On first round, choose randomly
        if (state.LastAiChoice == null)
            return GetRandomChoice();

        // 60% chance to repeat last choice
        if (_random.Next(100) < 60)
            return state.LastAiChoice.Value;

        // 40% chance: pick a random choice different from last
        var choices = GetOtherChoices(state.LastAiChoice.Value);
        return choices[_random.Next(choices.Count)];
    }

    /// <summary>
    /// Hard difficulty: AI uses frequency-based prediction.
    /// Counts player's move history and assumes they will repeat their most frequent move.
    /// Then counters that predicted move.
    /// If no clear winner, falls back to random.
    /// </summary>
    private Choice GetAiMoveHard(GameState state)
    {
        // If player has no history, choose randomly
        if (state.PlayerMoveHistory.Count == 0)
            return GetRandomChoice();

        // Count frequency of each choice
        var rockCount = state.PlayerMoveHistory.Count(c => c == Choice.Rock);
        var paperCount = state.PlayerMoveHistory.Count(c => c == Choice.Paper);
        var scissorsCount = state.PlayerMoveHistory.Count(c => c == Choice.Scissors);

        // Find the most frequent choice
        var maxCount = Math.Max(rockCount, Math.Max(paperCount, scissorsCount));

        // If there's a clear leader, predict and counter it
        if (maxCount > 0 && (rockCount == maxCount || paperCount == maxCount || scissorsCount == maxCount))
        {
            Choice predictedChoice;
            
            if (rockCount == maxCount && rockCount > paperCount && rockCount > scissorsCount)
                predictedChoice = Choice.Rock;
            else if (paperCount == maxCount && paperCount > rockCount && paperCount > scissorsCount)
                predictedChoice = Choice.Paper;
            else if (scissorsCount == maxCount && scissorsCount > rockCount && scissorsCount > paperCount)
                predictedChoice = Choice.Scissors;
            else
                // If counts are equal, fall back to random
                return GetRandomChoice();

            // Counter the predicted choice
            return GetCounterChoice(predictedChoice);
        }

        return GetRandomChoice();
    }

    /// <summary>
    /// Returns the choice that beats the given choice.
    /// </summary>
    private Choice GetCounterChoice(Choice choice)
    {
        return choice switch
        {
            Choice.Rock => Choice.Paper,      // Paper beats Rock
            Choice.Paper => Choice.Scissors,   // Scissors beats Paper
            Choice.Scissors => Choice.Rock,    // Rock beats Scissors
            _ => GetRandomChoice()
        };
    }

    /// <summary>
    /// Returns a list of choices that are different from the given choice.
    /// </summary>
    private List<Choice> GetOtherChoices(Choice choice)
    {
        var all = new[] { Choice.Rock, Choice.Paper, Choice.Scissors };
        return all.Where(c => c != choice).ToList();
    }

    /// <summary>
    /// Returns a random choice.
    /// </summary>
    private Choice GetRandomChoice()
    {
        var choices = new[] { Choice.Rock, Choice.Paper, Choice.Scissors };
        return choices[_random.Next(choices.Length)];
    }

    /// <summary>
    /// Converts a Choice enum to its emoji representation.
    /// </summary>
    public static string ChoiceToEmoji(Choice choice)
    {
        return choice switch
        {
            Choice.Rock => "✊",
            Choice.Paper => "✋",
            Choice.Scissors => "✌️",
            _ => "?"
        };
    }
}
