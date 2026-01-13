# 🎮 Kivi–Paperi–Sakset – Sovelluksen Dokumentaatio  
**Teknologia:** .NET 9, C#, AvaloniaUI  
**Tarkoitus:** Yksinkertainen peli, jossa käyttäjä pelaa tietokonetta vastaan.

---

## 1. Sovelluksen yleiskuvaus

Sovellus on yksinkertainen graafinen Kivi–Paperi–Sakset‑peli.  
Käyttäjä valitsee yhden kolmesta vaihtoehdosta, ja ohjelma arpoo oman valintansa.  
Pelin tulos näytetään ruudulla, ja käyttäjän voittomäärä kasvaa jokaisesta voitosta.

Peli ei käytä tekoälyä, vaan valinta tehdään satunnaisesti listasta:

- **Kivi**
- **Paperi**
- **Sakset**

---

## 2. Käyttöliittymän rakenne (AvaloniaUI)

Sovelluksessa on kaksi päätilaa:

### 🟦 2.1. Päävalikko
Näytöllä näkyy kaksi painiketta:

- **Aloita peli**
- **Lopeta peli**

**Aloita peli** siirtää käyttäjän pelinäkymään.  
**Lopeta peli** sulkee sovelluksen.

---

### 🟩 2.2. Pelinäkymä

Pelinäkymässä näkyy:

- Yläkulmassa:  
  **Voitot: X**  
  (X kasvaa jokaisesta käyttäjän voitosta)

- Kolme painiketta:
  - **Kivi**
  - **Paperi**
  - **Sakset**

Kun käyttäjä painaa jotain näistä:

1. Ohjelma arpoo oman valintansa.
2. Valintoja verrataan sääntöjen mukaan.
3. Näytetään tulos:
   - "Voitit!"
   - "Hävisit!"
   - "Tasapeli!"
4. Jos käyttäjä voitti, voittolaskuri kasvaa.

---

## 3. Pelilogiikka

### 3.1. Vaihtoehdot
```csharp
enum Choice
{
    Kivi,
    Paperi,
    Sakset
}
```

### 3.2. Satunnainen valinta
```csharp
var random = new Random();
Choice computerChoice = (Choice)random.Next(0, 3);
```

### 3.3. Voittajan määritys
```csharp
string GetWinner(Choice player, Choice computer)
{
    if (player == computer)
        return "Tasapeli";

    return (player, computer) switch
    {
        (Choice.Kivi, Choice.Sakset) => "Voitit",
        (Choice.Paperi, Choice.Kivi) => "Voitit",
        (Choice.Sakset, Choice.Paperi) => "Voitit",
        _ => "Hävisit"
    };
}
```

---

## 4. Sovelluksen rakenne

### 4.1. Projektin kansiorakenne (esimerkki)

```
/KiviPaperiSakset
 ├── Views
 │    ├── MainMenuView.axaml
 │    ├── GameView.axaml
 │    └── ...
 ├── ViewModels
 │    ├── MainMenuViewModel.cs
 │    ├── GameViewModel.cs
 │    └── ...
 ├── Models
 │    └── Choice.cs
 ├── App.axaml
 ├── Program.cs
 └── README.md
```

---

## 5. Pelin kulku

1. Sovellus käynnistyy → **MainMenuView**
2. Käyttäjä valitsee **Aloita peli**
3. Näkymä vaihtuu → **GameView**
4. Käyttäjä valitsee Kivi/Paperi/Sakset
5. Ohjelma arpoo oman valinnan
6. Tulokset näytetään
7. Voittolaskuri päivittyy (jos käyttäjä voitti)
8. Käyttäjä voi jatkaa valitsemalla uudelleen

---

## 6. Esimerkkikoodi: GameViewModel (lyhyt versio)

```csharp
public class GameViewModel : ViewModelBase
{
    private readonly Random _random = new();
    private int _wins;

    public int Wins
    {
        get => _wins;
        set => RaiseAndSetIfChanged(ref _wins, value);
    }

    public string ResultText { get; set; } = "";

    public void PlayerChoice(Choice playerChoice)
    {
        var computerChoice = (Choice)_random.Next(0, 3);
        var result = GetWinner(playerChoice, computerChoice);

        if (result == "Voitit")
            Wins++;

        ResultText = $"Sinä: {playerChoice}, Tietokone: {computerChoice}\n{result}";
        this.RaisePropertyChanged(nameof(ResultText));
        this.RaisePropertyChanged(nameof(Wins));
    }

    private string GetWinner(Choice player, Choice computer)
    {
        if (player == computer)
            return "Tasapeli";

        return (player, computer) switch
        {
            (Choice.Kivi, Choice.Sakset) => "Voitit",
            (Choice.Paperi, Choice.Kivi) => "Voitit",
            (Choice.Sakset, Choice.Paperi) => "Voitit",
            _ => "Hävisit"
        };
    }
}
```

---

## 7. Jatkokehitysideoita

- Lisää ääni- tai animaatioefektejä
- Lisää kierroslaskuri
- Lisää mahdollisuus nollata pisteet
- Tee erillinen tulosnäkymä kierroksen jälkeen


