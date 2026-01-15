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

        // Rock beats Scissors and Lizard
        if (playerChoice == Choice.Rock && (aiChoice == Choice.Scissors || aiChoice == Choice.Lizard))
            return RoundResult.Win;

        // Scissors beats Paper and Lizard
        if (playerChoice == Choice.Scissors && (aiChoice == Choice.Paper || aiChoice == Choice.Lizard))
            return RoundResult.Win;

        // Paper beats Rock and Spock
        if (playerChoice == Choice.Paper && (aiChoice == Choice.Rock || aiChoice == Choice.Spock))
            return RoundResult.Win;

        // Lizard beats Paper and Spock
        if (playerChoice == Choice.Lizard && (aiChoice == Choice.Paper || aiChoice == Choice.Spock))
            return RoundResult.Win;

        // Spock beats Scissors and Rock
        if (playerChoice == Choice.Spock && (aiChoice == Choice.Scissors || aiChoice == Choice.Rock))
            return RoundResult.Win;

        return RoundResult.Lose;
    }

    /// <summary>
    /// Generates AI move based on the current difficulty level.
    /// Normal: Biased toward repeating its previous move (60% repeat, 40% random).
    /// Hard: Uses frequency-based prediction of player's most common move and counters it.
    /// Nörtti: Adaptive strategy with balanced randomness and prediction.
    /// </summary>
    public Choice GetAiMove(GameState state)
    {
        return state.CurrentDifficulty switch
        {
            Difficulty.Normal => GetAiMoveNormal(state),
            Difficulty.Hard => GetAiMoveHard(state),
            Difficulty.Nörtti => GetAiMoveBotanica(state),
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
        var allChoices = new List<Choice> { Choice.Rock, Choice.Paper, Choice.Scissors, Choice.Lizard, Choice.Spock };
        var otherChoices = allChoices.Where(c => c != state.LastAiChoice.Value).ToList();
        return otherChoices[_random.Next(otherChoices.Count)];
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
    /// Botanica difficulty: Adaptive AI with mixed strategy.
    /// Uses player history, adjusts strategy based on performance, and incorporates randomness.
    /// </summary>
    private Choice GetAiMoveBotanica(GameState state)
    {
        // On first few rounds, choose randomly
        if (state.PlayerMoveHistory.Count < 3)
            return GetRandomChoice();

        // Count frequency of each choice
        var frequencies = new Dictionary<Choice, int>();
        foreach (Choice choice in Enum.GetValues(typeof(Choice)))
        {
            frequencies[choice] = state.PlayerMoveHistory.Count(c => c == choice);
        }

        // Find the most frequent choice
        var mostFrequent = frequencies.OrderByDescending(x => x.Value).First().Key;
        var maxCount = frequencies[mostFrequent];

        // 70% chance to use counter strategy, 30% chance for randomness to keep player guessing
        if (_random.Next(100) < 70 && maxCount > 0)
        {
            // Counter the most frequent player move
            return GetCounterChoice(mostFrequent);
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
            Choice.Rock => Choice.Paper,           // Paper beats Rock
            Choice.Paper => Choice.Scissors,        // Scissors beats Paper
            Choice.Scissors => Choice.Rock,         // Rock beats Scissors
            Choice.Lizard => Choice.Rock,           // Rock crushes Lizard
            Choice.Spock => Choice.Lizard,          // Lizard poisons Spock
            _ => GetRandomChoice()
        };
    }

    /// <summary>
    /// Returns a random choice.
    /// </summary>
    private Choice GetRandomChoice()
    {
        var choices = new[] { Choice.Rock, Choice.Paper, Choice.Scissors, Choice.Lizard, Choice.Spock };
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
            Choice.Lizard => "🦎",
            Choice.Spock => "🖖",
            _ => "?"
        };
    }
}
