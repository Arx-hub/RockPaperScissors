# RockPaperScissors
A project to practice using AI Agents on IDEs.

[![Play Rock Paper Scissors](https://img.shields.io/badge/play-online-brightgreen)](index.html)

## Documentation

User prompt (game specification):

"Can you make a simple rock paper scissors game, where there are four different images, a fist closed a hand opened and the peace or scissors sign. On the top in a square is the bot you can not see the result until you select one of the three buttons underneath, which include the options in images of the symbols you can make so again the fist, open hand or the scissors. When u press on of em it shows the one u selected and it also shows what the program selected above. What the program draws is determined randomly. Please make sure to put thiss prompt inside a readme file in a documentation section"

Files added:

- `index.html`: The playable web page.
- `style.css`: Styling for layout and buttons.
- `script.js`: Game logic and random bot selection.
- `images/hidden.svg`, `images/rock.svg`, `images/paper.svg`, `images/scissors.svg`: Simple SVG icons used by the game.

Usage: open `index.html` in a browser to play.

How to run locally

1. From the project folder start a simple HTTP server (Python 3):

```bash
python -m http.server 8000
```

2. Open this URL in your browser:

http://localhost:8000/index.html

How to play

- Click one of the three buttons (rock, paper, scissors) at the bottom to make your choice.
- The bot's choice will appear in the top-left box and your choice in the top-right box.
- The result ("You win", "You lose", or "Draw") will show below the boxes.
- Results are shown for 10 seconds, then the picks are hidden again (scores are kept).
- Use the `Reset` button to clear scores and start over.
