# Kivi-paperi-sakset

Yksinkertainen kivi-paperi-sakset -peli, joka on toteutettu C#-backendillä (minimal API) ja kevyellä HTML/JavaScript-frontendilla.

Ominaisuudet
- Pelaaja valitsee `kivi`, `paperi` tai `sakset` käyttöliittymästä.
- Backend arpoo tekoälyn valinnan ja palauttaa pelin tuloksen.
- Frontend näyttää tekoälyn valinnan ja tuloksen.

Esivaatimukset
- Asennettuna .NET SDK (versio 8.0+ suositeltu). Tarkista: `dotnet --info`

Käynnistys
1. Avaa komentorivi tai PowerShell.
2. Siirry projektiin:
```powershell
cd "c:\Users\User\OneDrive\Tiedostot\Omat koodit\AiAgent"
```
3. Käynnistä sovellus:
```powershell
dotnet run
```
4. Avaa selain osoitteeseen `http://localhost:5000/` (portti näkyy konsolissa jos eri).

Testaus komentoriviltä
```bash
curl -X POST http://localhost:5000/play -H "Content-Type: application/json" -d "{\"playerChoice\":\"kivi\"}"
```

Pelitiedostot
- `Program.cs` — backend ja pelilogiikka
- `AiAgent.csproj` — projektitiedosto
- `wwwroot/index.html` — yksinkertainen käyttöliittymä
- `wwwroot/app.js` — frontendin JavaScript
- `README.md` — tämä tiedosto

Kuinka peli toimii lyhyesti
- Frontend lähettää POST-pyynnön `/play`-päätepisteeseen JSONilla: `{ "playerChoice": "kivi" }`.
- Backend arpoo `aiChoice` ja vertailee valintoja funktiolla `DetermineWinner`.
- Backend vastaa JSONilla: `{ "aiChoice": "paperi", "result": "Hävisit!" }`.

Vianmääritys
- Jos `dotnet run` antaa virheen target-frameworkista, avaa `AiAgent.csproj` ja varmista `TargetFramework` vastaamaan asennettua .NET-versiota, tai asenna tarvittava SDK.
- Jos selain ei löydä sivua, varmista että palvelin on käynnissä ja jotain portissa kuunnellaan (konsoli ilmoittaa URLin).

Seuraavat kehitysaskelmat (valinnainen)
- Lisää pelin tilastot (voitot/tappiot)
- Lisää monikierros-tila
- Paranna käyttöliittymää ja tyyliä

Jos haluat, teen seuraavaksi jonkin yllä olevista lisäyksistä.
