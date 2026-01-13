const choices = ['rock','paper','scissors'];
let playerScore = 0, computerScore = 0;
const playerScoreEl = document.getElementById('player-score');
const computerScoreEl = document.getElementById('computer-score');
const resultEl = document.getElementById('result');
const buttons = document.querySelectorAll('.choice');
const resetBtn = document.getElementById('reset');

function computerChoice(){
  return choices[Math.floor(Math.random()*choices.length)];
}

function decide(player, comp){
  if(player === comp) return 'tie';
  if(
    (player === 'rock' && comp === 'scissors') ||
    (player === 'paper' && comp === 'rock') ||
    (player === 'scissors' && comp === 'paper')
  ) return 'win';
  return 'lose';
}

function updateScore(){
  playerScoreEl.textContent = playerScore;
  computerScoreEl.textContent = computerScore;
}

function showResult(player, comp, outcome){
  if(outcome === 'tie'){
    resultEl.textContent = `Tie — both chose ${player}`;
  } else if(outcome === 'win'){
    resultEl.textContent = `You win! ${player} beats ${comp}`;
  } else {
    resultEl.textContent = `You lose. ${comp} beats ${player}`;
  }
}

buttons.forEach(btn => {
  btn.addEventListener('click', ()=>{
    const player = btn.dataset.choice;
    const comp = computerChoice();
    const outcome = decide(player, comp);

    // flash winner
    buttons.forEach(b=>b.classList.remove('win'));
    if(outcome === 'win') btn.classList.add('win');

    if(outcome === 'win') playerScore++;
    else if(outcome === 'lose') computerScore++;

    updateScore();
    showResult(player, comp, outcome);
  });
});

resetBtn.addEventListener('click', ()=>{
  playerScore = 0; computerScore = 0; updateScore(); resultEl.textContent = 'Make your move';
  buttons.forEach(b=>b.classList.remove('win'));
});

// keyboard shortcuts: R P S
window.addEventListener('keydown', (e)=>{
  const key = e.key.toLowerCase();
  if(key === 'r' || key === 'p' || key === 's'){
    const map = {r:'rock',p:'paper',s:'scissors'};
    document.querySelector(`[data-choice="${map[key]}"]`).click();
  }
});