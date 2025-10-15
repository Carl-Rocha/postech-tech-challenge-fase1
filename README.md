# Tech Challenge Fase 01

Aplicação de gerenciamento financeiro desenvolvida com Next.js e um Design System próprio.
O projeto possui páginas para listagem, criação e edição de transações, utilizando componentes reutilizáveis
(botões, inputs, tipografia e cards) e conceitos de Programação Orientada a Objetos.

## Pré-requisitos

- Node.js 18+
- Yarn

## Instalação

```bash
yarn install
```

## Executando em desenvolvimento

O repositório agora está configurado com arquitetura **multi-zonas**. O app principal continua em `src/app`
e expõe a zona administrativa hospedada em `zones/admin` por meio de regras de reescrita configuradas em `next.config.ts`.
Para experimentar o fluxo completo execute os comandos abaixo em terminais separados:

```bash
# Terminal 1 – aplicação financeira (porta 3000)
yarn dev

# Terminal 2 – zona administrativa isolada (porta 3001)
yarn dev:admin
```

Acesse [http://localhost:3000](http://localhost:3000) para visualizar a aplicação principal.
Todo acesso ao caminho `/admin` será roteado automaticamente para a zona administrativa que está rodando
em [http://localhost:3001](http://localhost:3001).

Caso deseje apontar o app principal para uma instância diferente em produção, defina a variável de ambiente
`ADMIN_ZONE_URL` com o domínio público da zona administrativa.

## Build

Compile cada zona separadamente:

```bash
# App principal
yarn build

# Zona administrativa
yarn build:admin
```

## Produção

Após compilar, suba cada serviço individualmente:

```bash
# App principal
yarn start

# Zona administrativa
yarn start:admin
```

Garanta que a variável `ADMIN_ZONE_URL` do aplicativo principal aponte para a URL pública (sem barra no final)
da zona administrativa antes de iniciar o servidor.

## Lint

```bash
yarn lint
```

## Arquitetura Multi‑Zonas (Admin + Transações)

O app principal (`src/app`) expõe zonas independentes via rewrites:

- Admin: `zones/admin` (basePath `/admin`)
- Transações: `zones/transactions` (basePath `/transactions`)

Executar tudo em desenvolvimento:

```bash
# Um comando para todas as apps (principal, transações e admin)
yarn dev:full

# Ou, separadamente
yarn dev               # principal (porta 3000)
yarn dev:transactions  # transações (porta 3002)
yarn dev:admin         # admin (porta 3001)
```

Env de produção (opcional):

- `ADMIN_ZONE_URL` => URL pública da zona admin
- `TRANSACTIONS_ZONE_URL` => URL pública da zona de transações
