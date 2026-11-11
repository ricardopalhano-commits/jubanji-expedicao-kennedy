// Sons do jogo gerados pelo próprio navegador (Web Audio API): sem arquivos de áudio.
const Som = (() => {
  let ac = null, mestre = null, musG = null, timer = null, passo = 0, prox = 0, mudo = false;
  try { mudo = localStorage.getItem('jubanji-mudo') === '1'; } catch (e) {}

  const PASSO = 0.25;                                  // duração de cada nota da música (segundos)
  const A = [12, null, 15, 12, 10, null, 7, null, 10, null, 12, 10, 7, null, 5, null,
             7, null, 10, 7, 5, null, 3, null, 5, 7, 10, null, 12, null, null, null];
  const B = [17, null, 15, 12, 15, null, 12, null, 10, 12, 15, null, 12, 10, 7, null,
             12, null, 10, 7, 10, null, 5, 7, 3, null, 5, 7, 10, null, 12, null];
  const MEL = [...A, ...B];                            // 16 segundos antes de repetir
  const BAIXO = [-12, -9, -7, -5];

  function iniciar() {
    if (!ac) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ac = new AC();
      mestre = ac.createGain(); mestre.gain.value = mudo ? 0 : 1; mestre.connect(ac.destination);
      musG = ac.createGain(); musG.gain.value = 0.35; musG.connect(mestre);
    }
    if (ac.state === 'suspended') ac.resume();
    return true;
  }

  function nota(freq, t, dur, tipo, vol, dest) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = tipo; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest || mestre);
    o.start(t); o.stop(t + dur + 0.05);
  }
  const hz = (semitons) => 220 * Math.pow(2, semitons / 12);

  function agendar() {
    while (prox < ac.currentTime + 0.3) {
      const i = passo % MEL.length, compasso = Math.floor(i / 8) % 4;
      if (MEL[i] !== null) nota(hz(MEL[i]), prox, 0.22, 'triangle', 0.2, musG);
      if (i % 4 === 0) nota(hz(BAIXO[compasso]), prox, 0.5, 'sine', 0.25, musG);
      prox += PASSO; passo++;
    }
  }

  function musica(ligar) {
    if (ligar) {
      if (!iniciar() || timer) return;
      passo = 0; prox = ac.currentTime + 0.1;
      timer = setInterval(agendar, 100);
    } else if (timer) { clearInterval(timer); timer = null; }
  }

  function plim() {                                   // acertou: som agudo de sino
    if (!iniciar()) return;
    const t = ac.currentTime;
    nota(988, t, 0.5, 'sine', 0.3); nota(1319, t + 0.12, 0.8, 'sine', 0.3); nota(1976, t + 0.12, 0.5, 'sine', 0.08);
  }
  function errado() {                                 // errou: som grave descendente
    if (!iniciar()) return;
    const t = ac.currentTime;
    nota(196, t, 0.3, 'sawtooth', 0.16); nota(138, t + 0.22, 0.55, 'sawtooth', 0.16);
  }

  // Botão de ligar/desligar o som (a escolha fica salva)
  const btn = document.querySelector('#som');
  const rotulo = () => { btn.textContent = mudo ? '🔇 Som: desligado' : '🔊 Som: ligado'; };
  btn.addEventListener('click', () => {
    mudo = !mudo;
    try { localStorage.setItem('jubanji-mudo', mudo ? '1' : '0'); } catch (e) {}
    if (mestre) mestre.gain.value = mudo ? 0 : 1;
    rotulo();
  });
  rotulo();

  // Pausa o som quando a aba fica escondida
  document.addEventListener('visibilitychange', () => {
    if (!ac) return;
    if (document.hidden) ac.suspend(); else if (timer) ac.resume();
  });

  return { iniciar, musica, plim, errado };
})();
