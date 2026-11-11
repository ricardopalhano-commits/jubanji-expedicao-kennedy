const $ = (s) => document.querySelector(s);
const W = 880, H = 480, META = 8;
const cv = $('#cv'), cx = cv.getContext('2d');

const FASES = [
  { nome: 'Floresta Tropical', img: '/img/fase1.jpg', bons: ['🍎', '💧', '🍌'], ruins: ['🪨', '🐍'], perguntas: [] },
  { nome: 'Savana e Deserto', img: '/img/fase2.jpg', bons: ['💧', '🍉', '🥭'], ruins: ['🌵', '🦂'], perguntas: [] }
];
const POR_FASE = 2;

// Sorteia perguntas diferentes do banco a cada partida
function sortearPerguntas() {
  const pool = [...BANCO];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  FASES.forEach((f, i) => {
    f.perguntas = pool.slice(i * POR_FASE, (i + 1) * POR_FASE)
      .map(([p, certa, ...erradas]) => ({ p, o: [certa, ...erradas], c: 0 }));
  });
}
const fundos = FASES.map((f) => { const i = new Image(); i.src = f.img; return i; });

let jogador = '', est = null;
const keys = { l: false, r: false };

async function api(url, opcoes = {}) {
  const r = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...opcoes });
  if (r.status === 204) return null;
  const d = await r.json();
  if (!r.ok) throw new Error(d.erro || 'Falha na requisição.');
  return d;
}
const esc = (t) => { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; };
const fmt = (s) => (s >= 60 ? `${Math.floor(s / 60)}min ${s % 60}s` : `${s}s`);
const abrir = (id) => ['menu', 'jogo', 'fim'].forEach((x) => { $('#' + x).hidden = x !== id; });
const sorte = (a) => a[Math.floor(Math.random() * a.length)];

// ---------- Jogo ----------
function novoJogo() {
  sortearPerguntas();
  est = { fase: 0, pts: 0, vidas: 3, col: 0, objs: [], flash: 0, spawn: 0, rodando: false, ultimo: 0,
    t0: Date.now(), wolf: { x: W / 2, alvo: W / 2 } };
  $('#quiz').hidden = true;
  $('#gameover').hidden = true;
  abrir('jogo');
  iniciarFase();
}

function iniciarFase() {
  est.col = 0; est.objs = []; est.rodando = true; est.ultimo = performance.now();
  requestAnimationFrame(loop);
}

function loop(t) {
  if (!est || !est.rodando) return;
  const dt = Math.min((t - est.ultimo) / 1000, 0.05);
  est.ultimo = t;
  atualizar(dt); desenhar();
  requestAnimationFrame(loop);
}

function atualizar(dt) {
  const w = est.wolf, f = FASES[est.fase];
  if (keys.l) w.alvo = w.x - 300; else if (keys.r) w.alvo = w.x + 300;
  w.alvo = Math.max(40, Math.min(W - 40, w.alvo));
  const d = w.alvo - w.x;
  w.x += Math.sign(d) * Math.min(Math.abs(d), 560 * dt);

  est.spawn -= dt;
  if (est.spawn <= 0) {
    est.spawn = 0.7;
    const bom = Math.random() < 0.65;
    est.objs.push({ x: 40 + Math.random() * (W - 80), y: -30, v: 130 + Math.random() * 90 + est.fase * 40,
      bom, e: sorte(bom ? f.bons : f.ruins) });
  }
  est.flash = Math.max(0, est.flash - dt);
  est.objs = est.objs.filter((o) => {
    o.y += o.v * dt;
    if (Math.abs(o.x - w.x) < 42 && Math.abs(o.y - (H - 60)) < 44) {
      if (o.bom) { est.col++; est.pts += 10; } else { est.vidas--; est.flash = 0.3; }
      return false;
    }
    return o.y < H + 40;
  });

  if (est.vidas <= 0) derrota();
  else if (est.col >= META) { est.rodando = false; perguntar(0); }
}

function desenhar() {
  const img = fundos[est.fase];
  if (img.complete && img.naturalWidth) {
    const r = Math.max(W / img.naturalWidth, H / img.naturalHeight);
    const w = img.naturalWidth * r, h = img.naturalHeight * r;
    cx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
  } else { cx.fillStyle = '#22372a'; cx.fillRect(0, 0, W, H); }

  cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.font = '40px serif';
  est.objs.forEach((o) => cx.fillText(o.e, o.x, o.y));
  cx.font = '64px serif'; cx.fillText('🐺', est.wolf.x, H - 60);

  if (est.flash > 0) { cx.fillStyle = 'rgba(229,96,79,.35)'; cx.fillRect(0, 0, W, H); }
  cx.fillStyle = 'rgba(0,0,0,.6)'; cx.fillRect(0, 0, W, 38);
  cx.fillStyle = '#f3ecd2'; cx.font = 'bold 20px sans-serif'; cx.textAlign = 'left';
  cx.fillText(`${FASES[est.fase].nome}     ❤️ ${est.vidas}     🎒 ${est.col}/${META}     ⭐ ${est.pts}`, 12, 20);
}

// ---------- Perguntas ----------
function perguntar(i) {
  const f = FASES[est.fase], q = f.perguntas[i];
  const ops = q.o.map((t, k) => ({ t, ok: k === q.c })).sort(() => Math.random() - 0.5);
  const box = $('#quiz'); box.hidden = false;
  box.innerHTML = `<div class="qcard">
    <p class="qt">Pergunta da escola ${i + 1} de ${f.perguntas.length}</p>
    <h3>${q.p}</h3>
    ${ops.map((o, k) => `<button class="op" data-k="${k}">${o.t}</button>`).join('')}
    <p id="fb"></p></div>`;
  box.querySelectorAll('.op').forEach((b) => b.onclick = () => {
    box.querySelectorAll('.op').forEach((x) => { x.disabled = true; if (ops[x.dataset.k].ok) x.classList.add('certa'); });
    if (ops[b.dataset.k].ok) { est.pts += 50; $('#fb').textContent = 'Correto! +50 pontos'; }
    else { b.classList.add('errada'); $('#fb').textContent = 'Resposta errada. A certa ficou em verde.'; }
    setTimeout(() => (i + 1 < f.perguntas.length ? perguntar(i + 1) : proximaFase()), 1500);
  });
}

function proximaFase() {
  $('#quiz').hidden = true;
  est.fase++;
  if (est.fase >= FASES.length) vitoria(); else iniciarFase();
}

// ---------- Fim de jogo ----------
function derrota() {
  est.rodando = false;
  $('#gotxt').textContent = `${jogador}, as 3 vidas acabaram na fase ${est.fase + 1} e você fez ${est.pts} pontos. Só expedições completas entram no ranking.`;
  $('#gameover').hidden = false;
  $('#retry').focus();
}

async function vitoria() {
  est.pts += est.vidas * 20;
  const seg = Math.round((Date.now() - est.t0) / 1000);
  $('#imgfim').hidden = false; abrir('fim');
  let txt = `Parabéns, ${jogador}! Você completou a expedição com ${est.pts} pontos em ${fmt(seg)}.`;
  $('#msg').textContent = txt;
  try {
    await api('/api/expedicoes', { method: 'POST', body: JSON.stringify({ jogador, pontos: est.pts, segundos: seg }) });
    $('#msg').textContent = txt + ' Pontuação salva no ranking.';
    carregar();
  } catch (e) { $('#msg').textContent = txt + ' Não foi possível salvar: ' + e.message; }
}

// ---------- Controles ----------
function mover(e) {
  if (!est || !est.rodando) return;
  const r = cv.getBoundingClientRect();
  est.wolf.alvo = (e.clientX - r.left) / r.width * W;
}
cv.addEventListener('pointermove', mover);
cv.addEventListener('pointerdown', mover);
addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a') keys.l = true;
  if (e.key === 'ArrowRight' || e.key === 'd') keys.r = true;
  if (est && est.rodando && e.key.startsWith('Arrow')) e.preventDefault();
});
addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a') keys.l = false;
  if (e.key === 'ArrowRight' || e.key === 'd') keys.r = false;
  if (est) est.wolf.alvo = est.wolf.x;
});

$('#inicio').addEventListener('submit', (e) => {
  e.preventDefault(); jogador = $('#nome').value.trim(); novoJogo();
  cv.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
$('#again').addEventListener('click', novoJogo);
$('#retry').addEventListener('click', novoJogo);
$('#voltar').addEventListener('click', () => { est = null; $('#gameover').hidden = true; abrir('menu'); scrollTo(0, 0); });

// ---------- Ranking (consultar, editar, excluir) ----------
async function carregar() {
  try {
    const p = await api('/api/expedicoes');
    $('#lista').innerHTML = p.length ? p.map((x, i) => `
      <li>
        <span class="n">${i + 1}º ${esc(x.jogador)}</span>
        <span class="m">${x.pontos} pontos · ${fmt(x.segundos)}</span>
        <span class="bt">
          <button class="sec" data-a="editar" data-id="${x.id}">Editar nome</button>
          <button class="ex" data-a="excluir" data-id="${x.id}">Excluir</button>
        </span>
      </li>`).join('') : '<li class="vazio">Nenhuma expedição concluída ainda. Seja o primeiro!</li>';
  } catch (e) { $('#lista').innerHTML = '<li class="vazio">Não foi possível carregar o ranking.</li>'; }
}

$('#lista').addEventListener('click', async (e) => {
  const b = e.target.closest('[data-a]'); if (!b) return;
  try {
    if (b.dataset.a === 'editar') {
      const nome = prompt('Novo nome do jogador:');
      if (nome && nome.trim()) await api(`/api/expedicoes/${b.dataset.id}`, { method: 'PUT', body: JSON.stringify({ jogador: nome }) });
    } else if (confirm('Excluir esta pontuação?')) {
      await api(`/api/expedicoes/${b.dataset.id}`, { method: 'DELETE' });
    }
    carregar();
  } catch (err) { alert(err.message); }
});

// ---------- PWA ----------
if ('serviceWorker' in navigator) navigator.serviceWorker.register('/service-worker.js');
let evInstalar;
addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); evInstalar = e; $('#instalar').hidden = false; });
$('#instalar').addEventListener('click', async () => {
  if (!evInstalar) return;
  evInstalar.prompt(); await evInstalar.userChoice; evInstalar = null; $('#instalar').hidden = true;
});

carregar();
