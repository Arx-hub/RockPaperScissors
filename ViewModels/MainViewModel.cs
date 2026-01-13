using System;
using System.Reactive;
using ReactiveUI;

namespace KiviPaperiSakset.ViewModels
{
    public class MainViewModel : ViewModelBase
    {
        private ViewModelBase _currentViewModel;

        public ViewModelBase CurrentViewModel
        {
            get => _currentViewModel;
            set => this.RaiseAndSetIfChanged(ref _currentViewModel, value);
        }

        public MainViewModel()
        {
            var mainMenuViewModel = new MainMenuViewModel();
            mainMenuViewModel.StartGameCommand.Subscribe((Unit _) =>
            {
                CurrentViewModel = new GameViewModel();
            });

            _currentViewModel = mainMenuViewModel;
        }
    }
}
