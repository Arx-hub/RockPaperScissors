using System;
using System.Reactive;
using KiviPaperiSakset.Models;
using ReactiveUI;

namespace KiviPaperiSakset.ViewModels
{
    public class GameViewModel : ViewModelBase
    {
        private readonly Random _random = new();
        private int _wins;
        private string _resultText = "";
        private string _choiceDisplay = "";

        public int Wins
        {
            get => _wins;
            set => this.RaiseAndSetIfChanged(ref _wins, value);
        }

        public string ResultText
        {
            get => _resultText;
            set => this.RaiseAndSetIfChanged(ref _resultText, value);
        }

        public string ChoiceDisplay
        {
            get => _choiceDisplay;
            set => this.RaiseAndSetIfChanged(ref _choiceDisplay, value);
        }

        public ReactiveCommand<Unit, Unit> KiviCommand { get; }
        public ReactiveCommand<Unit, Unit> PaperiCommand { get; }
        public ReactiveCommand<Unit, Unit> SaksetCommand { get; }
        public ReactiveCommand<Unit, Unit> ExitCommand { get; }

        public GameViewModel()
        {
            KiviCommand = ReactiveCommand.Create(() => PlayerChoice(Choice.Kivi));
            PaperiCommand = ReactiveCommand.Create(() => PlayerChoice(Choice.Paperi));
            SaksetCommand = ReactiveCommand.Create(() => PlayerChoice(Choice.Sakset));
            ExitCommand = ReactiveCommand.Create(() => 
            {
                Environment.Exit(0);
            });

            Wins = 0;
            ResultText = "Valitse aloittaaksesi";
            ChoiceDisplay = "";
        }

        public void PlayerChoice(Choice playerChoice)
        {
            var computerChoice = (Choice)_random.Next(0, 3);
            var result = GetWinner(playerChoice, computerChoice);

            if (result == "Voitit!")
                Wins++;

            ChoiceDisplay = $"Sinä: {GetChoiceName(playerChoice)} | Tietokone: {GetChoiceName(computerChoice)}";
            ResultText = result;
        }

        private string GetChoiceName(Choice choice)
        {
            return choice switch
            {
                Choice.Kivi => "Kivi",
                Choice.Paperi => "Paperi",
                Choice.Sakset => "Sakset",
                _ => ""
            };
        }

        private string GetWinner(Choice player, Choice computer)
        {
            if (player == computer)
                return "Tasapeli!";

            return (player, computer) switch
            {
                (Choice.Kivi, Choice.Sakset) => "Voitit!",
                (Choice.Paperi, Choice.Kivi) => "Voitit!",
                (Choice.Sakset, Choice.Paperi) => "Voitit!",
                _ => "Hävisit!"
            };
        }
    }
}
