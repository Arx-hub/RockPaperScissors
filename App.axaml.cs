using Avalonia;
using Avalonia.Markup.Xaml;

namespace KiviPaperiSakset
{
    public partial class App : Application
    {
        public override void Initialize()
        {
            AvaloniaXamlLoader.Load(this);
        }

        public override void OnFrameworkInitializationCompleted()
        {
            if (ApplicationLifetime is not null)
            {
                var desktop = ApplicationLifetime as dynamic;
                desktop.MainWindow = new MainWindow();
            }

            base.OnFrameworkInitializationCompleted();
        }
    }
}
