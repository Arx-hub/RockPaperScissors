# documentation for an AI agent

## Kivi–Paperi–Sakset vs AI

Selainkäyttöinen kivi-paperi-sakset -peli, jossa pelataan tekoälyä vastaan. Peli on toteutettu C#:lla käyttäen ASP.NET Core:a ja moderneja web-tekniikoita.

### Ominaisuudet

- **Pelin perustoiminnot:**
  - Pelaaja valitsee kiven (✊), paperin (✋) tai sakset (✌️)
  - AI vastaa omalla valinnallaan
  - Tulos näytetään heti valinnan jälkeen

- **Pisteiden seuranta:**
  - Kierrosten kokonaismäärä
  - Pelaajan voitot
  - AI:n voitot
  - Tasapelit
  - Reset-nappi kaikkien lukujen nollaamiseen

- **Vaikeustasot:**
  - **Helppo (Normal):** AI toistaa edellisen siirtoaan 60% todennäköisyydellä, mikä tekee siitä ennakoitavaa
  - **Vaikea (Hard):** AI käyttää pelaajan siirtohistoriaa ja valitsee vastahyökkäyksen pelaajan yleisimmän siirron perusteella

- **Teema-vaihtelu:**
  - **Vaaleanpunainen teema** (oletuksena)
  - **Tummansininen teema**
  - Teema-vaihto-nappi vasemmassa yläkulmassa

### Esitietovaatimukset

- **.NET 8.0 SDK** tai uudempi. Tarkista: `dotnet --version`
- Selain, joka tukee HTML5:tä ja JavaScriptiä

### Käynnistys

1. Avaa PowerShell tai komentorivi
2. Siirry projektin juurikansioon:
   ```powershell
   cd "c:\Users\User\OneDrive\Tiedostot\Omat koodit\RockPaperScissors\AiAgent"
   ```
3. Käynnistä sovellus:
   ```powershell
   dotnet run
   ```
4. Avaa selaimessa osoite joka näkyy konsolissa (yleensä `https://localhost:5001` tai `http://localhost:5000`)

### Pelin logiikka

#### Voittokriteerit

- **Kivi** voittaa **sakset**
- **Sakset** voittaa **paperin**
- **Paperi** voittaa **kiven**
- Sama valinta = **tasapeli**

#### Vaikeusastot yksityiskohtaisesti

**Helppo (Normal):**
- Ensimmäisellä kierroksella AI valitsee satunnaisesti
- Seuraavilla kierroksilla AI toistaa edellisen siirtojaan 60% todennäköisyydellä
- 40% todennäköisyydellä valitsee jonkin muun siirron
- Tuloksena AI on ennustettava

**Vaikea (Hard):**
- AI seuraa pelaajan siirtohistoriaa
- Laskee kuinka monta kertaa pelaaja on valinnut kiven, paperia ja saksia
- Oletuksena pelaaja toistaa yleisintä siirtojaan
- AI valitsee siirron, joka voittaa tämän ennustetun siirron
- Tasatilanteissa AI valitsee satunnaisesti

### Projektin rakenne

```
AiAgent/
├── Program.cs              # API-päätypisteen määritys ja sovelluksen käynnistys
├── AiAgent.csproj          # Projektitiedosto
├── Game/
│   ├── GameState.cs        # Pelin tilanteen hallinta (pisteet, vaikeustaso, teema)
│   └── GameLogic.cs        # Pelimekaaniikan logiikka (voittajien määritys, AI-algoritmit)
├── wwwroot/
│   ├── index.html          # Pelin käyttöliittymä
│   ├── app.js              # Frontendin JavaScript-logiikka
│   └── site.css            # Tyylit ja teema-määrittelyt
└── README.md               # Tämä tiedosto
```

### API-päätypisteeet

- **POST `/game/play`** — Pelaa kierrosta
  - Pyyntö: `{ "playerChoice": "Rock" }` (Rock, Paper, Scissors)
  - Vastaus: `{ "playerChoice": "Rock", "aiChoice": "Scissors", "result": "Win", "totalRounds": 1, "playerWins": 1, "aiWins": 0, "draws": 0 }`

- **POST `/game/reset`** — Nollaa pelin
  - Vastaus: `{ "totalRounds": 0, "playerWins": 0, "aiWins": 0, "draws": 0 }`

- **POST `/game/difficulty`** — Aseta vaikeustaso
  - Pyyntö: `{ "difficulty": "Normal" }` (Normal, Hard)
  - Vastaus: `{ "difficulty": "Normal" }`

- **POST `/game/theme`** — Aseta teema
  - Pyyntö: `{ "theme": "Pink" }` (Pink, Blue)
  - Vastaus: `{ "theme": "Pink" }`

- **GET `/game/state`** — Hae nykyinen pelin tila
  - Vastaus: `{ "totalRounds": 0, "playerWins": 0, "aiWins": 0, "draws": 0, "difficulty": "Normal", "theme": "Pink" }`

### Testaus komentoriviltä

```powershell
# Pelaa kierrosta
Invoke-WebRequest -Uri "http://localhost:5000/game/play" -Method Post `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"playerChoice":"Rock"}' | Select-Object -ExpandProperty Content

# Nollaa peli
Invoke-WebRequest -Uri "http://localhost:5000/game/reset" -Method Post `
  -Headers @{"Content-Type"="application/json"} | Select-Object -ExpandProperty Content

# Aseta vaikeustaso
Invoke-WebRequest -Uri "http://localhost:5000/game/difficulty" -Method Post `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"difficulty":"Hard"}' | Select-Object -ExpandProperty Content
```

### Tekijätiedot

Toteutettu C# ja ASP.NET Corella modernilla web-arkkitehtuurilla, jossa pelilogiikka on erillään käyttöliittymästä.

### Tulevaisuuden laajennukset

Koodissa on jätetty paikat seuraavien lisäominaisuuksien toteutukselle:

- **Animaatiot** — Painikkeiden hover-efektit ja siirtymäanimaatiot
- **Äänitehosteet** — Napsautus-, voitto- ja häviöäänien lisääminen
- **Pelin historiatiedot** — Edellisten kierrosten tiedot

### Vianmääritys

- **"Virhe: yhteydessä palvelimeen"**
  - Varmista että palvelin on käynnissä (`dotnet run` -komennolla)
  - Tarkista että käytät oikeaa porttia (konsolissa näkyvä URL)

- **"Failed to load game state"**
  - Päivitä sivu (F5)
  - Tarkista selaimen konsooli (F12) virheilmoitusten varalta

- **Portin virhe**
  - Avaa toinen PowerShell-ikkuna
  - Listaa portit käytössä: `netstat -ano | findstr :5000` (Windows)
  - Tarvittaessa käynnistä uudelleen

### Lisenssi

Vapaa käyttö ja muokkaaminen.

Jos haluat, teen seuraavaksi jonkin yllä olevista lisäyksistä.
