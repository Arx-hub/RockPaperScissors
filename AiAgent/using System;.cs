using System;

class ConsoleProgram
{
    static void Main()
    {
        PlayGame();
    }

    static void PlayGame()
    {
        Console.WriteLine("Valitse kivi, paperi tai sakset:");
        string? input = Console.ReadLine();
        string playerChoice = (input ?? string.Empty).ToLowerInvariant();
        string aiChoice = GetAIChoice();
        
        Console.WriteLine($"Tekoäly valitsi: {aiChoice}");
        string result = DetermineWinner(playerChoice, aiChoice);
        Console.WriteLine(result);
    }

    static string GetAIChoice()
    {
        Random random = new Random();
        string[] choices = { "kivi", "paperi", "sakset" };
        return choices[random.Next(choices.Length)];
    }

    static string DetermineWinner(string playerChoice, string aiChoice)
    {
        if (playerChoice == aiChoice)
        {
            return "Tasapeli!";
        }
        else if ((playerChoice == "kivi" && aiChoice == "sakset") ||
                 (playerChoice == "paperi" && aiChoice == "kivi") ||
                 (playerChoice == "sakset" && aiChoice == "paperi"))
        {
            return "Voitit!";
        }
        else
        {
            return "Hävisit!";
        }
    }
}