// Game logic for Rock Paper Scissors
const CHOICES = ["rock","paper","scissors"]

function init(){
  const buttons = document.querySelectorAll('.choice-btn')
  buttons.forEach(b=> b.addEventListener('click', ()=> handleChoice(b.dataset.choice)))
  document.getElementById('tryAgain').addEventListener('click', resetRound)
}

function handleChoice(playerChoice){
  const botChoice = getComputerChoice()
  const result = determineResult(playerChoice, botChoice)
  updateUI({playerChoice, botChoice, result})
}

function getComputerChoice(){
  const i = Math.floor(Math.random()*CHOICES.length)
  return CHOICES[i]
}

function determineResult(player, bot){
  if(player===bot) return 'draw'
  if((player==='rock' && bot==='scissors') ||
     (player==='paper' && bot==='rock') ||
     (player==='scissors' && bot==='paper')) return 'win'
  return 'lose'
}

function updateUI({playerChoice, botChoice, result}){
  const panel = document.getElementById('resultPanel')
  const banner = document.getElementById('resultBanner')
  const botDisplay = document.getElementById('botChoice')
  const playerDisplay = document.getElementById('playerChoice')

  // set images
  botDisplay.innerHTML = `<img src="assets/${botChoice}.svg" alt="${botChoice}">`
  playerDisplay.innerHTML = `<img src="assets/${playerChoice}.svg" alt="${playerChoice}">`

  // banner text
  if(result==='win'){
    banner.textContent = 'You Win!'
    banner.style.color = '#ffd36b'
  } else if(result==='lose'){
    banner.textContent = 'You Lose...'
    banner.style.color = '#ff6b6b'
  } else {
    banner.textContent = "It's a Draw"
    banner.style.color = '#cfe7ff'
  }

  panel.classList.remove('hidden')
}

function resetRound(){
  document.getElementById('resultPanel').classList.add('hidden')
}

window.addEventListener('DOMContentLoaded', init)
