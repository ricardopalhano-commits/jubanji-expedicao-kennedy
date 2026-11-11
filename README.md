# Jubanji: Expedição dos Biomas

Jogo 2D educativo, instalável no celular (PWA). Um lobo explorador atravessa biomas, coleta suprimentos, desvia de perigos e responde perguntas de escola (geografia e ciências). A pontuação final fica salva em um banco de dados.

- **Desenvolvido com IA** (assistente de IA, em substituição ao OpenCode nesta entrega)
- **Front-end:** HTML, CSS e JavaScript puros (jogo em `<canvas>`)
- **Back-end:** Node.js + Express
- **Banco de dados:** PostgreSQL
- **PWA:** `manifest.json` + `service-worker.js`
- **CRUD do ranking:** cadastrar pontuação (ao vencer), consultar, editar nome e excluir

## Como rodar localmente
```bash
npm install
DATABASE_URL=postgres://usuario:senha@localhost:5432/jubanji npm start
```
Acesse http://localhost:3000

## Links
- Sistema online: (cole aqui o link do Render)
- Repositório: (cole aqui o link do GitHub)
