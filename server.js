const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost')
    ? { rejectUnauthorized: false } : false
});

async function iniciarBanco() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tarefas (
      id SERIAL PRIMARY KEY,
      titulo TEXT NOT NULL,
      descricao TEXT DEFAULT '',
      prioridade TEXT NOT NULL DEFAULT 'media',
      concluida BOOLEAN NOT NULL DEFAULT FALSE,
      criada_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`);
}

const PRIORIDADES = ['baixa', 'media', 'alta'];
const validar = (b) => {
  if (!b.titulo || !b.titulo.trim()) return 'Informe um título.';
  if (!PRIORIDADES.includes(b.prioridade)) return 'Prioridade inválida.';
  return null;
};
const tratar = (fn) => (req, res) => fn(req, res).catch((e) => {
  console.error(e); res.status(500).json({ erro: 'Erro no servidor.' });
});

// Consultar
app.get('/api/tarefas', tratar(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM tarefas ORDER BY concluida, id DESC');
  res.json(rows);
}));

// Cadastrar
app.post('/api/tarefas', tratar(async (req, res) => {
  const erro = validar(req.body);
  if (erro) return res.status(400).json({ erro });
  const { titulo, descricao = '', prioridade } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO tarefas (titulo, descricao, prioridade) VALUES ($1,$2,$3) RETURNING *',
    [titulo.trim(), descricao.trim(), prioridade]);
  res.status(201).json(rows[0]);
}));

// Editar
app.put('/api/tarefas/:id', tratar(async (req, res) => {
  const erro = validar(req.body);
  if (erro) return res.status(400).json({ erro });
  const { titulo, descricao = '', prioridade, concluida = false } = req.body;
  const { rows } = await pool.query(
    'UPDATE tarefas SET titulo=$1, descricao=$2, prioridade=$3, concluida=$4 WHERE id=$5 RETURNING *',
    [titulo.trim(), descricao.trim(), prioridade, !!concluida, req.params.id]);
  if (!rows.length) return res.status(404).json({ erro: 'Tarefa não encontrada.' });
  res.json(rows[0]);
}));

// Excluir
app.delete('/api/tarefas/:id', tratar(async (req, res) => {
  const { rowCount } = await pool.query('DELETE FROM tarefas WHERE id=$1', [req.params.id]);
  if (!rowCount) return res.status(404).json({ erro: 'Tarefa não encontrada.' });
  res.status(204).end();
}));

const PORT = process.env.PORT || 3000;
iniciarBanco()
  .then(() => app.listen(PORT, () => console.log('Rodando na porta ' + PORT)))
  .catch((e) => { console.error('Falha ao conectar no banco:', e.message); process.exit(1); });
