using System;
using System.Reactive;
using ReactiveUI;

namespace KiviPaperiSakset.ViewModels
{
    public class MainMenuViewModel : ViewModelBase
    {
        public ReactiveCommand<Unit, Unit> StartGameCommand { get; }
        public ReactiveCommand<Unit, Unit> ExitCommand { get; }

        public MainMenuViewModel()
        {
            StartGameCommand = ReactiveCommand.Create(() => { });
            ExitCommand = ReactiveCommand.Create(() => 
            {
                Environment.Exit(0);
            });
        }
    }
}
