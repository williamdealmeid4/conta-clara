# Conta Clara

Aplicação de demonstração para registrar receitas e despesas por categoria e acompanhar o resumo mensal. Utiliza API TypeScript e PostgreSQL. Valores são armazenados em centavos inteiros para evitar erros de ponto flutuante.

## Executar

Requisitos: Node.js 20+ e um banco PostgreSQL vazio. Configure `DATABASE_URL` e execute:

```sh
npm install
npm run db:setup
npm start
```

Acesse `http://127.0.0.1:3001`. No PowerShell, configure uma conexão local com `$env:DATABASE_URL = 'postgresql://usuario:senha@localhost:5432/financas'`. Use credenciais próprias e nunca as envie ao repositório.

Execute `npm test` para verificar as regras monetárias e `npm run typecheck` para verificar os tipos. A aplicação é uma demonstração local sem autenticação ou autorização e não deve ser exposta à internet.