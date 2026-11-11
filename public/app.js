const $ = (s) => document.querySelector(s);
const W = 880, H = 480, MAXV = 5;

const BONS = ['🍎', '🍌', '💧', '🍉', '🥭', '🍇'];
const RUINS = ['🪨', '🐍', '🦂', '🌵', '🕷️', '🔥', '☄️'];   // mais perigos nas fases avançadas
const NIVEL = { facil: { n: 'Fácil', pts: 50 }, medio: { n: 'Médio', pts: 75 }, dificil: { n: 'Difícil', pts: 100 } };
// Nível das 2 perguntas de cada uma das 10 fases (fica mais difícil)
const NIVEIS = [['facil', 'facil'], ['facil', 'facil'], ['facil', 'medio'], ['medio', 'medio'], ['medio', 'medio'],
  ['medio', 'medio'], ['medio', 'dificil'], ['dificil', 'dificil'], ['dificil', 'dificil'], ['dificil', 'dificil']];

// bg: qual imagem (0 = trilha, 1 = quatro biomas), zoom, foco horizontal/vertical e cor de ambiente
const FASES = [
  { nome: 'Trilha da Floresta', bg: { img: 0, zoom: 1, fx: .5, fy: .5 } },
  { nome: 'Ruínas Antigas', bg: { img: 1, zoom: 1.7, fx: 0, fy: .6 } },
  { nome: 'Savana Dourada', bg: { img: 1, zoom: 1.7, fx: .38, fy: .6 } },
  { nome: 'Entardecer na Savana', bg: { img: 1, zoom: 1.7, fx: .5, fy: .5, tint: 'rgba(255,120,40,.22)' } },
  { nome: 'Pântano Sombrio', bg: { img: 1, zoom: 1.7, fx: .72, fy: .6 } },
  { nome: 'Deserto Rochoso', bg: { img: 1, zoom: 1.7, fx: 1, fy: .6 } },
  { nome: 'Deserto à Noite', bg: { img: 1, zoom: 1.7, fx: 1, fy: .4, tint: 'rgba(10,20,70,.5)' } },
  { nome: 'Pântano da Meia-Noite', bg: { img: 1, zoom: 1.7, fx: .72, fy: .4, tint: 'rgba(5,10,40,.55)' } },
  { nome: 'Selva Misteriosa', bg: { img: 0, zoom: 1.5, fx: .1, fy: .5, tint: 'rgba(0,30,10,.35)' } },
  { nome: 'Templo Final', bg: { img: 0, zoom: 1.8, fx: .05, fy: .6, tint: 'rgba(255,200,60,.18)' } }
];
const fundos = ['/img/fase1.jpg', '/img/fase2.jpg'].map((s) => { const i = new Image(); i.src = s; return i; });

// Dificuldade do jogo: cresce com o número da fase (i) e com os erros nas perguntas (dif)
const cfg = (i, dif) => ({
  meta: 6 + i,                                                     // suprimentos para passar (6 a 15)
  v: Math.max(80, 110 + i * 22 + dif * 20),                        // velocidade de queda
  spawn: Math.max(0.3, Math.min(1.2, 0.8 - i * 0.04 - dif * 0.05)), // intervalo entre objetos
  bom: Math.max(0.35, Math.min(0.8, 0.7 - i * 0.025 - dif * 0.04)), // chance de ser fruta
  vx: i >= 4 ? (i - 3) * 25 : 0                                    // perigos se mexem de lado
});
const rotuloDif = (d) => (d <= -2 ? 'Muito fácil' : d === -1 ? 'Fácil' : d === 0 ? 'Normal' : d === 1 ? 'Difícil' : 'Muito difícil');

let jogador = '', est = null;
const keys = { l: false, r: false };
const cv = $('#cv'), cx = cv.getContext('2d');

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
function embaralhar(a) {
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// Sorteia perguntas diferentes do banco a cada partida, no nível de cada fase
function sortearPerguntas() {
  const pools = {};
  Object.keys(BANCO).forEach((k) => { pools[k] = embaralhar([...BANCO[k]]); });
  FASES.forEach((f, i) => {
    f.perguntas = NIVEIS[i].map((t) => {
      const [p, certa, ...erradas] = pools[t].pop();
      return { p, o: [certa, ...erradas], c: 0, t };
    });
  });
}

// ---------- Jogo ----------
function novoJogo() {
  sortearPerguntas();
  Som.musica(true);
  est = { fase: 0, pts: 0, vidas: 3, col: 0, meta: 6, objs: [], flash: 0, spawn: 0, dif: 0, difIni: 0,
    aviso: null, avisoT: 0, rodando: false, ultimo: 0, t0: Date.now(), wolf: { x: W / 2, alvo: W / 2 } };
  $('#quiz').hidden = true;
  $('#gameover').hidden = true;
  abrir('jogo');
  iniciarFase();
  est.aviso = [{ t: `FASE 1: ${FASES[0].nome}`, c: '#f3ecd2' }]; est.avisoT = 3;
}

function iniciarFase() {
  est.col = 0; est.meta = cfg(est.fase, 0).meta; est.objs = []; est.rodando = true; est.ultimo = performance.now();
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
  const w = est.wolf, c = cfg(est.fase, est.dif);
  if (keys.l) w.alvo = w.x - 300; else if (keys.r) w.alvo = w.x + 300;
  w.alvo = Math.max(40, Math.min(W - 40, w.alvo));
  const d = w.alvo - w.x;
  w.x += Math.sign(d) * Math.min(Math.abs(d), 560 * dt);

  est.spawn -= dt;
  if (est.spawn <= 0) {
    est.spawn = c.spawn;
    const bom = Math.random() < c.bom;
    const perigos = RUINS.slice(0, 2 + Math.floor(est.fase * 0.6));
    est.objs.push({ x: 40 + Math.random() * (W - 80), y: -30, v: c.v + Math.random() * 90, bom,
      e: sorte(bom ? BONS : perigos), vx: bom ? 0 : (Math.random() < 0.5 ? -1 : 1) * c.vx * (0.4 + Math.random() * 0.6) });
  }
  est.flash = Math.max(0, est.flash - dt);
  est.avisoT = Math.max(0, est.avisoT - dt);
  est.objs = est.objs.filter((o) => {
    o.y += o.v * dt; o.x += o.vx * dt;
    if (o.x < 30 || o.x > W - 30) o.vx *= -1;
    if (Math.abs(o.x - w.x) < 42 && Math.abs(o.y - (H - 60)) < 44) {
      if (o.bom) { est.col++; est.pts += 10; } else { est.vidas--; est.flash = 0.3; }
      return false;
    }
    return o.y < H + 40;
  });

  if (est.vidas <= 0) derrota();
  else if (est.col >= est.meta) { est.rodando = false; perguntar(0); }
}

function desenhar() {
  const b = FASES[est.fase].bg, img = fundos[b.img];
  if (img.complete && img.naturalWidth) {
    const r = Math.max(W / img.naturalWidth, H / img.naturalHeight) * b.zoom;
    const w = img.naturalWidth * r, h = img.naturalHeight * r;
    cx.drawImage(img, -(w - W) * b.fx, -(h - H) * b.fy, w, h);
  } else { cx.fillStyle = '#22372a'; cx.fillRect(0, 0, W, H); }
  if (b.tint) { cx.fillStyle = b.tint; cx.fillRect(0, 0, W, H); }

  cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.font = '40px serif';
  est.objs.forEach((o) => cx.fillText(o.e, o.x, o.y));
  cx.font = '64px serif'; cx.fillText('🐺', est.wolf.x, H - 60);

  if (est.flash > 0) { cx.fillStyle = 'rgba(229,96,79,.35)'; cx.fillRect(0, 0, W, H); }
  cx.fillStyle = 'rgba(0,0,0,.6)'; cx.fillRect(0, 0, W, 38);
  cx.fillStyle = '#f3ecd2'; cx.font = 'bold 20px sans-serif'; cx.textAlign = 'left';
  cx.fillText(`Fase ${est.fase + 1}/${FASES.length}     ❤️ ${est.vidas}     🎒 ${est.col}/${est.meta}     ⭐ ${est.pts}`, 12, 20);
  cx.textAlign = 'right'; cx.fillText('Dificuldade: ' + rotuloDif(est.dif), W - 12, 20);

  if (est.avisoT > 0 && est.aviso) {
    const n = est.aviso.length;
    cx.fillStyle = 'rgba(0,0,0,.78)'; cx.fillRect(W / 2 - 320, 60, 640, 16 + 36 * n);
    cx.textAlign = 'center'; cx.font = 'bold 26px sans-serif';
    est.aviso.forEach((l, k) => { cx.fillStyle = l.c; cx.fillText(l.t, W / 2, 86 + 36 * k); });
  }
}

// ---------- Perguntas ----------
function perguntar(i) {
  const f = FASES[est.fase], q = f.perguntas[i], nv = NIVEL[q.t];
  const ops = embaralhar(q.o.map((t, k) => ({ t, ok: k === q.c })));
  const box = $('#quiz'); box.hidden = false;
  box.innerHTML = `<div class="qcard">
    <p class="qt">Fase ${est.fase + 1}: pergunta ${i + 1} de ${f.perguntas.length} · Nível ${nv.n} (+${nv.pts} pontos)</p>
    <h3>${q.p}</h3>
    ${ops.map((o, k) => `<button class="op" data-k="${k}">${o.t}</button>`).join('')}
    <p id="fb"></p></div>`;
  box.querySelectorAll('.op').forEach((b) => b.onclick = () => {
    box.querySelectorAll('.op').forEach((x) => { x.disabled = true; if (ops[x.dataset.k].ok) x.classList.add('certa'); });
    const certa = ops[b.dataset.k].ok, ultima = est.fase + 1 >= FASES.length;
    if (certa) Som.plim(); else Som.errado();
    if (certa) { est.pts += nv.pts; est.dif = Math.max(-3, est.dif - 1); }
    else { b.classList.add('errada'); est.dif = Math.min(4, est.dif + 1); }
    $('#fb').innerHTML = (certa ? `Correto! +${nv.pts} pontos` : 'Resposta errada. A certa ficou em verde.') +
      (ultima ? '' : certa ? '<br><span class="dif-facil">✅ A fase ficou mais fácil!</span>'
                           : '<br><span class="dif-dificil">⚠️ ! A fase está mais difícil !</span>');
    setTimeout(() => (i + 1 < f.perguntas.length ? perguntar(i + 1) : proximaFase()), 1500);
  });
}

function proximaFase() {
  $('#quiz').hidden = true;
  const delta = est.dif - est.difIni; est.difIni = est.dif;
  const feita = est.fase; est.fase++;
  if (est.fase >= FASES.length) { vitoria(); return; }
  const linhas = [{ t: `FASE ${est.fase + 1}: ${FASES[est.fase].nome}`, c: '#f3ecd2' }];
  if (delta > 0) linhas.push({ t: '! A FASE ESTÁ MAIS DIFÍCIL !', c: '#ff7a6b' });
  else if (delta < 0) linhas.push({ t: 'A FASE FICOU MAIS FÁCIL', c: '#5cc98a' });
  if ((feita + 1) % 3 === 0 && est.vidas < MAXV) { est.vidas++; linhas.push({ t: '❤️ +1 vida!', c: '#e0a526' }); }
  iniciarFase();
  est.aviso = linhas; est.avisoT = 3.5;
}

// ---------- Fim de jogo ----------
function derrota() {
  est.rodando = false;
  Som.musica(false);
  $('#gotxt').textContent = `${jogador}, as vidas acabaram na fase ${est.fase + 1} de ${FASES.length} e você fez ${est.pts} pontos. Só expedições completas entram no ranking.`;
  $('#gameover').hidden = false;
  $('#retry').focus();
}

async function vitoria() {
  Som.musica(false);
  est.pts += est.vidas * 20;
  const seg = Math.round((Date.now() - est.t0) / 1000);
  $('#imgfim').hidden = false; abrir('fim');
  const txt = `Parabéns, ${jogador}! Você completou as ${FASES.length} fases com ${est.pts} pontos em ${fmt(seg)}.`;
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
$('#voltar').addEventListener('click', () => { est = null; Som.musica(false); $('#gameover').hidden = true; abrir('menu'); scrollTo(0, 0); });

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
