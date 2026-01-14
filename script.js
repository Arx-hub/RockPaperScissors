const choices = ["rock","paper","scissors"]
const botImg = document.getElementById('botImg')
const playerImg = document.getElementById('playerImg')
const resultText = document.getElementById('result')
const botScoreEl = document.getElementById('botScore')
const playerScoreEl = document.getElementById('playerScore')
const resetBtn = document.getElementById('resetBtn')

const DEFAULT_RESULT = 'Choose rock, paper, or scissors below.'

let botScore = 0
let playerScore = 0
let hideTimer = null

function choiceToPath(c){
  return `images/${c}.svg`
}

function decide(player, bot){
  if(player===bot) return 'Draw'
  if(player==='rock' && bot==='scissors') return 'You win'
  if(player==='scissors' && bot==='paper') return 'You win'
  if(player==='paper' && bot==='rock') return 'You win'
  return 'You lose'
}

document.querySelectorAll('.choice').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const player = btn.dataset.choice
    // clear any pending hide timer so we don't prematurely hide
    if(hideTimer) clearTimeout(hideTimer)
    // show player's pick
    playerImg.src = choiceToPath(player)

    // random bot pick
    const bot = choices[Math.floor(Math.random()*choices.length)]
    // reveal bot
    botImg.src = choiceToPath(bot)

    // result
    const r = decide(player, bot)
    resultText.textContent = r

    // update scores (don't change scores on Draw)
    if(r === 'You win'){
      playerScore += 1
      playerScoreEl.textContent = playerScore
    } else if(r === 'You lose'){
      botScore += 1
      botScoreEl.textContent = botScore
    }

    // after 10s, hide picks and restore default result text but keep scores
    hideTimer = setTimeout(()=>{
      playerImg.src = 'images/hidden.svg'
      botImg.src = 'images/hidden.svg'
      resultText.textContent = DEFAULT_RESULT
      hideTimer = null
    }, 10000)
  })
})

resetBtn.addEventListener('click', ()=>{
  // clear any pending hide timer
  if(hideTimer) { clearTimeout(hideTimer); hideTimer = null }
  // reset images and scores
  playerImg.src = 'images/hidden.svg'
  botImg.src = 'images/hidden.svg'
  playerScore = 0
  botScore = 0
  playerScoreEl.textContent = playerScore
  botScoreEl.textContent = botScore
  resultText.textContent = DEFAULT_RESULT
})
