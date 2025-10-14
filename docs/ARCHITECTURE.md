# Arquitetura e Estratégia de Evolução

Este documento resume como a aplicação atende aos pilares solicitados no Tech Challenge: microfrontends, gerenciamento de estado avançado (Redux) e containerização (Docker).

## Visão geral atual
- **Host Next.js**: o projeto atua como host, responsável pelo roteamento, layout compartilhado e autenticação.
- **Redux Toolkit**: o estado global de transações é centralizado e tipado, permitindo compartilhamento consistente entre módulos.
- **Docker**: o repositório traz Dockerfile multi-stage e orquestração com Docker Compose para facilitar desenvolvimento e deploy.

## Microfrontends

### Topologia proposta
- `host` (este repositório): shell com navegação, autenticação e store Redux.
- `dashboard-mf`: microfrontend especializado em dashboards e widgets.
- `transactions-mf`: microfrontend responsável pelas funcionalidades de extrato, filtros e formulário.
- `settings-mf`: microfrontend dedicado às preferências do usuário.

O host carrega os remotes dinamicamente usando Module Federation. A preparação no `next.config.ts` consiste em acoplar o plugin [`@module-federation/nextjs-mf`](https://github.com/module-federation/universe/tree/main/packages/nextjs-mf) e declarar os remotes. No App Router, cada rota utiliza `next/dynamic` para importar o bundle remoto (`dynamic(() => import('dashboard/App'))`).

### Comunicação e contratos
- **Compartilhamento de estado**: o host expõe a store Redux através de um provider comum. Remotes consomem hooks tipados `useAppSelector`/`useAppDispatch` exportados pelo host via `shared` Module Federation.
- **Modelos de dados**: as interfaces TypeScript existentes em `src/models` são compartilhadas como contratos comuns.
- **Eventos complementares**: para interações específicas que não justificam estado global (ex.: toasts), recomenda-se expor utilitários em `src/utils` e compartilhá-los como módulos singleton no `shared`.

## Gerenciamento de Estado (Redux)
- `src/store/index.ts` configura a store com middleware customizado que ignora verificações de serialização para anexos base64.
- `src/features/transactions/transactionSlice.ts` concentra reducers e thunks síncronos para carregar, adicionar, editar e remover transações.
- `src/hooks/redux.ts` disponibiliza hooks tipados para consumo seguro de `RootState` e `AppDispatch`.

Essa estrutura permite que os microfrontends reutilizem lógica de domínio sem duplicação, mantendo a aplicação consistente quando novos remotes forem conectados.

## Containerização (Docker)
- **Dockerfile**: multi-stage com fases `deps`, `development`, `build` e `production`. Proporciona builds determinísticos com `npm ci`, além de uma imagem final enxuta.
- **docker-compose.yml**: sobe o host em modo desenvolvimento com hot reload via bind mount. O arquivo foi preparado para receber novos serviços (remotes adicionais ou backend dedicado) caso necessário.
- **.dockerignore**: reduz o contexto de build ignorando `node_modules`, `.next`, arquivos temporários e logs.

## Próximos passos sugeridos
1. Configurar Module Federation no `next.config.ts` e publicar os remotes (`dashboard-mf`, `transactions-mf`, `settings-mf`).
2. Expor adaptadores de autenticação e notificações como módulos compartilhados (`shared`) para uso uniforme entre remotes.
3. Adicionar pipelines de CI/CD independentes para cada microfrontend e atualizar variáveis de ambiente no host apontando para os manifests de produção.
4. Expandir o Redux com novos slices (ex.: `preferences`) à medida que funcionalidades forem distribuídas entre remotes.

Com essa base, garantimos alinhamento com os requisitos de microfrontends, mantemos um ponto único de verdade para o estado crítico e entregamos uma solução pronta para ser executada em ambientes containerizados.
