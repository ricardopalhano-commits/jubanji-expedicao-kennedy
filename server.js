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
    CREATE TABLE IF NOT EXISTS expedicoes (
      id SERIAL PRIMARY KEY,
      jogador TEXT NOT NULL,
      pontos INTEGER NOT NULL,
      segundos INTEGER NOT NULL,
      criada_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`);
}

const nomeOk = (n) => typeof n === 'string' && n.trim() && n.trim().length <= 30;
const tratar = (fn) => (req, res) => fn(req, res).catch((e) => {
  console.error(e); res.status(500).json({ erro: 'Erro no servidor.' });
});

// Consultar ranking (mais pontos primeiro; empate: mais rápido)
app.get('/api/expedicoes', tratar(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM expedicoes ORDER BY pontos DESC, segundos, id LIMIT 50');
  res.json(rows);
}));

// Cadastrar pontuação
app.post('/api/expedicoes', tratar(async (req, res) => {
  const { jogador, pontos, segundos } = req.body;
  if (!nomeOk(jogador)) return res.status(400).json({ erro: 'Informe um nome de até 30 letras.' });
  if (!Number.isInteger(pontos) || pontos < 0 || !Number.isInteger(segundos) || segundos < 0)
    return res.status(400).json({ erro: 'Pontuação inválida.' });
  const { rows } = await pool.query(
    'INSERT INTO expedicoes (jogador, pontos, segundos) VALUES ($1,$2,$3) RETURNING *',
    [jogador.trim(), pontos, segundos]);
  res.status(201).json(rows[0]);
}));

// Editar nome do jogador
app.put('/api/expedicoes/:id', tratar(async (req, res) => {
  if (!nomeOk(req.body.jogador)) return res.status(400).json({ erro: 'Informe um nome de até 30 letras.' });
  const { rows } = await pool.query('UPDATE expedicoes SET jogador=$1 WHERE id=$2 RETURNING *',
    [req.body.jogador.trim(), req.params.id]);
  if (!rows.length) return res.status(404).json({ erro: 'Registro não encontrado.' });
  res.json(rows[0]);
}));

// Excluir pontuação
app.delete('/api/expedicoes/:id', tratar(async (req, res) => {
  const { rowCount } = await pool.query('DELETE FROM expedicoes WHERE id=$1', [req.params.id]);
  if (!rowCount) return res.status(404).json({ erro: 'Registro não encontrado.' });
  res.status(204).end();
}));

const PORT = process.env.PORT || 3000;
iniciarBanco()
  .then(() => app.listen(PORT, () => console.log('Rodando na porta ' + PORT)))
  .catch((e) => { console.error('Falha ao conectar no banco:', e.message); process.exit(1); });
