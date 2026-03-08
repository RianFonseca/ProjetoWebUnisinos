# SaúdeVida

Projeto web desenvolvido como atividade extensionista acadêmica, com o tema **Cuidado em Saúde**.

O SaúdeVida é uma aplicação web (SPA) que reúne funcionalidades voltadas ao acompanhamento da saúde pessoal: agendamento de consultas, diário de saúde, catálogo de profissionais e gerenciamento de perfil com dados médicos.

Tudo roda no navegador, sem backend — os dados ficam salvos no `localStorage`.

## Stack

- HTML5, CSS3, JavaScript (vanilla)
- Bootstrap Icons
- Google Fonts (Inter)

## Como rodar

Basta servir os arquivos com qualquer servidor HTTP. O jeito mais rápido:

```bash
cd ProjetoWeb
python3 -m http.server 9090
```

Depois acesse [http://localhost:9090](http://localhost:9090).

## Funcionalidades

- **Login/Cadastro** — sistema simples de autenticação local
- **Home** — visão geral com dicas de saúde rotativas
- **Agendamentos** — CRUD de consultas com filtros e busca
- **Diário de Saúde** — registro diário de humor, água, sono e pressão arterial, com mini gráficos
- **Profissionais** — catálogo com filtro por especialidade e favoritos
- **Perfil** — dados pessoais, informações de saúde (alergias, medicamentos, condições), contatos de emergência, cálculo de IMC, export/import de dados

## Estrutura

```
ProjetoWeb/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── app.js
    ├── auth.js
    ├── storage.js
    ├── home.js
    ├── agendamentos.js
    ├── diario.js
    ├── profissionais.js
    └── perfil.js
```
# ProjetoWebUnisinos
