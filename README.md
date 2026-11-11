# Tarefas — PWA com CRUD e PostgreSQL

Sistema web de controle de tarefas, instalável no celular (PWA).

- **Desenvolvido com IA** (assistente de IA, em substituição ao OpenCode nesta entrega)
- **Front-end:** HTML, CSS e JavaScript puros
- **Back-end:** Node.js + Express
- **Banco de dados:** PostgreSQL
- **PWA:** `manifest.json` + `service-worker.js`
- **Funcionalidades:** cadastrar, consultar, editar, excluir, concluir e filtrar tarefas

## Como rodar localmente
```bash
npm install
DATABASE_URL=postgres://usuario:senha@localhost:5432/tarefas npm start
```
Acesse http://localhost:3000

## Estrutura
```
server.js          API REST + conexão com o banco
public/            interface, PWA e ícones
```

## Links
- Sistema online: (cole aqui o link do Render)
- Repositório: (cole aqui o link do GitHub)
