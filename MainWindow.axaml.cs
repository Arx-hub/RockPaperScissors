using Avalonia.Controls;
using Avalonia.Markup.Xaml;
using KiviPaperiSakset.ViewModels;
using KiviPaperiSakset.Views;

namespace KiviPaperiSakset
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            DataContext = new MainViewModel();
        }

        private void InitializeComponent()
        {
            AvaloniaXamlLoader.Load(this);
        }
    }
}
