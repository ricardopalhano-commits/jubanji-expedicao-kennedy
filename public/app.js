const $ = (s) => document.querySelector(s);
let tarefas = [];
let filtro = 'todas';

async function api(url, opcoes = {}) {
  const r = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...opcoes });
  if (r.status === 204) return null;
  const dados = await r.json();
  if (!r.ok) throw new Error(dados.erro || 'Falha na requisição.');
  return dados;
}

async function carregar() {
  try { tarefas = await api('/api/tarefas'); desenhar(); }
  catch (e) { $('#lista').innerHTML = '<li class="vazio">Sem conexão com o servidor. Tente novamente.</li>'; }
}

function esc(t) {
  const d = document.createElement('div'); d.textContent = t; return d.innerHTML;
}

function desenhar() {
  const pend = tarefas.filter((t) => !t.concluida).length;
  $('#resumo').textContent = tarefas.length
    ? `${pend} pendente(s) de ${tarefas.length}` : 'Nenhuma tarefa ainda';
  const vis = tarefas.filter((t) =>
    filtro === 'todas' || (filtro === 'pendentes' ? !t.concluida : t.concluida));
  $('#lista').innerHTML = vis.length ? vis.map((t) => `
    <li class="${t.prioridade} ${t.concluida ? 'feita' : ''}">
      <input type="checkbox" data-a="check" data-id="${t.id}" ${t.concluida ? 'checked' : ''} aria-label="Concluir">
      <div>
        <div class="t">${esc(t.titulo)}</div>
        ${t.descricao ? `<p class="d">${esc(t.descricao)}</p>` : ''}
        <span class="m">Prioridade ${t.prioridade} · ${new Date(t.criada_em).toLocaleDateString('pt-BR')}</span>
      </div>
      <div class="botoes">
        <button class="sec" data-a="editar" data-id="${t.id}">Editar</button>
        <button class="ex" data-a="excluir" data-id="${t.id}">Excluir</button>
      </div>
    </li>`).join('') : '<li class="vazio">Nada por aqui. Adicione uma tarefa acima.</li>';
}

function limparForm() {
  $('#form').reset(); $('#id').value = '';
  $('#form-titulo').textContent = 'Nova tarefa';
  $('#salvar').textContent = 'Adicionar tarefa';
  $('#cancelar').hidden = true; $('#erro').textContent = '';
}

$('#form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = $('#id').value;
  const corpo = {
    titulo: $('#titulo').value, descricao: $('#descricao').value, prioridade: $('#prioridade').value
  };
  try {
    if (id) {
      const atual = tarefas.find((t) => t.id == id);
      await api(`/api/tarefas/${id}`, { method: 'PUT', body: JSON.stringify({ ...corpo, concluida: atual.concluida }) });
    } else {
      await api('/api/tarefas', { method: 'POST', body: JSON.stringify(corpo) });
    }
    limparForm(); await carregar();
  } catch (err) { $('#erro').textContent = err.message; }
});

$('#cancelar').addEventListener('click', limparForm);

$('#lista').addEventListener('click', async (e) => {
  const b = e.target.closest('[data-a]'); if (!b) return;
  const t = tarefas.find((x) => x.id == b.dataset.id);
  if (b.dataset.a === 'editar') {
    $('#id').value = t.id; $('#titulo').value = t.titulo;
    $('#descricao').value = t.descricao; $('#prioridade').value = t.prioridade;
    $('#form-titulo').textContent = 'Editar tarefa';
    $('#salvar').textContent = 'Salvar alterações';
    $('#cancelar').hidden = false; $('#titulo').focus();
  } else if (b.dataset.a === 'excluir') {
    if (!confirm('Excluir esta tarefa?')) return;
    await api(`/api/tarefas/${t.id}`, { method: 'DELETE' }); carregar();
  }
});

$('#lista').addEventListener('change', async (e) => {
  if (e.target.dataset.a !== 'check') return;
  const t = tarefas.find((x) => x.id == e.target.dataset.id);
  await api(`/api/tarefas/${t.id}`, { method: 'PUT', body: JSON.stringify({ ...t, concluida: e.target.checked }) });
  carregar();
});

document.querySelectorAll('.filtros button').forEach((b) => b.addEventListener('click', () => {
  filtro = b.dataset.f;
  document.querySelectorAll('.filtros button').forEach((x) => x.classList.toggle('on', x === b));
  desenhar();
}));

// PWA: service worker e botão de instalação
if ('serviceWorker' in navigator) navigator.serviceWorker.register('/service-worker.js');
let evInstalar;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); evInstalar = e; $('#instalar').hidden = false;
});
$('#instalar').addEventListener('click', async () => {
  if (!evInstalar) return;
  evInstalar.prompt(); await evInstalar.userChoice;
  evInstalar = null; $('#instalar').hidden = true;
});

carregar();
