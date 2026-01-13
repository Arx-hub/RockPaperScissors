function clearSelection(){
  document.querySelectorAll('.choice').forEach(el=>el.classList.remove('selected'));
}

async function play(choice){
  clearSelection();
  const el = document.getElementById('choice-' + choice);
  if(el) el.classList.add('selected');

  // Show a small waiting hint
  const resultEl = document.getElementById('result');
  resultEl.textContent = 'Odota...';

  try{
    const res = await fetch('/play', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ playerChoice: choice })
    });
    const data = await res.json();

    // Highlight AI choice briefly
    clearAiselection();
    const aiEl = document.getElementById('choice-' + data.aiChoice);
    if(aiEl){
      aiEl.classList.add('ai');
      setTimeout(()=>aiEl.classList.remove('ai'), 900);
    }

    // Show animated result
    resultEl.innerHTML = '';
    const msg = document.createElement('div');
    msg.className = 'result-msg';
    const lower = (data.result || '').toLowerCase();
    if(lower.includes('voit')) msg.classList.add('result-success');
    else if(lower.includes('hävis')) msg.classList.add('result-fail');
    else msg.classList.add('result-draw');
    msg.textContent = `Tekoäly: ${data.aiChoice} — ${data.result}`;
    resultEl.appendChild(msg);
    // remove message after a while
    setTimeout(()=>{ if(resultEl.contains(msg)) resultEl.removeChild(msg) }, 3500);
  }catch(err){
    resultEl.textContent = 'Virhe: ei yhteyttä palvelimeen.';
  }
}

function clearAiselection(){
  document.querySelectorAll('.choice.ai').forEach(el=>el.classList.remove('ai'));
}

// Theme toggle and initialization
function toggleTheme(){
  const body = document.body;
  const current = body.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  body.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeButton(next);
}

function updateThemeButton(theme){
  const btn = document.getElementById('theme-toggle');
  if(!btn) return;
  btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Apply saved theme on load
document.addEventListener('DOMContentLoaded', ()=>{
  const saved = localStorage.getItem('theme') || 'light';
  document.body.setAttribute('data-theme', saved);
  updateThemeButton(saved);
});
