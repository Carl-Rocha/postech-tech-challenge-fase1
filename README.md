# Tech Challenge — Fase 2

Aplicação de gerenciamento financeiro construída com Next.js (App Router) e um pequeno design system local. Há páginas para listar, criar e editar transações, além de um fluxo simples de autenticação em rotas de API.

O projeto suporta modo “multi‑zonas” (apps independentes para Admin e Transações) e, quando essas zonas não estão ativas, há fallback para as páginas locais do app principal.

## Requisitos

- Node.js 18+ (ou 20+)
- Yarn (Corepack habilitado)

## Instalação

- `yarn install`

## Desenvolvimento

- App principal (porta 3000): `yarn dev`
- Zona de Transações (porta 3002): `yarn dev:transactions`
- Tudo junto (principal + transações): `yarn dev:full:all`

Acesse `http://localhost:3000` para o app principal. Se os rewrites de zona estiverem habilitados (ver “Multi‑zonas e fallback”), `/admin` e `/transactions` serão delegados para as zonas; caso contrário, as rotas locais atendem normalmente.

## Multi‑zonas e Fallback

- Zonas opcionais:
  - Transações: `zones/transactions` (basePath `/transactions`)
- Os rewrites do `next.config.ts` só são criados quando você habilita explicitamente via ambiente:
  - `ENABLE_TRANSACTIONS_ZONE=true` e `TRANSACTIONS_ZONE_URL=https://seu-transacoes.dominio`
- Sem essas variáveis, o app principal atende as rotas locais. Isso serve como fallback automático: desabilite o rewrite e a rota local volta a responder.

Página de Transações em duplicidade (para garantir o mesmo comportamento em ambos os contextos):

- App principal: `src/app/transactions/page.tsx`
- Zona de Transações: `zones/transactions/app/page.tsx`

## Build e Produção

- App principal:
  - `yarn build`
  - `yarn start`
- Zona Admin:
  - `yarn build:admin`
  - `yarn start:admin`

Ambiente recomendado em produção:

- `ENABLE_ADMIN_ZONE`, `ADMIN_ZONE_URL`
- `ENABLE_TRANSACTIONS_ZONE`, `TRANSACTIONS_ZONE_URL`
- `JWT_SECRET` (defina um valor seu)

## Docker

- Build da imagem: `docker build -t postech-app .`
- Executar: `docker run --rm -p 3000:3000 postech-app`

## Lint

- `yarn lint`

## Notas

- `localStorage` e APIs do navegador aparecem apenas em componentes client.
- `TransactionService` garante `id` válido mesmo quando a origem não fornece esse campo.
- Rewrites só são gerados quando habilitados por variáveis, evitando apontar para hosts inexistentes.
