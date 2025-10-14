# Tech Challenge Fase 01

Aplicação de gerenciamento financeiro desenvolvida com Next.js 15, TypeScript e Redux Toolkit. O projeto evolui a base da Fase 01 com gráficos analíticos, filtros avançados de transações e formulário enriquecido com upload de comprovantes. A arquitetura foi preparada para encaixar a estratégia de microfrontends definida na disciplina, documentada em [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Tecnologias principais
- **Next.js 15 / React 19** com App Router
- **Redux Toolkit** para gerenciamento de estado compartilhado entre módulos
- **Material UI + Design System próprio** para composição da interface
- **Docker** e **Docker Compose** para containerização e orquestração de ambientes

## Pré-requisitos
- Node.js 18+
- npm 10+
- Docker 24+ (opcional, apenas para execução containerizada)

## Instalação das dependências

```bash
npm install
```

## Executando em desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

## Lint

```bash
npm run lint
```

> ℹ️ O relatório de lint aponta pontos de melhoria pendentes herdados da base anterior. As regras não foram silenciadas para manter a visibilidade dos itens a serem tratados nas próximas iterações.

## Execução com Docker

A aplicação pode ser executada com Docker tanto para desenvolvimento quanto para distribuição.

### Build de imagem de produção

```bash
docker build -t tech-challenge-web .
```

```bash
docker run --rm -p 3000:3000 tech-challenge-web
```

### Ambiente de desenvolvimento com Docker Compose

```bash
docker compose up --build
```

O serviço `web` monta o código-fonte local via bind mount, permitindo hot reload dentro do contêiner.

## Estrutura de pastas

```
src/
├── app/                 # App Router (páginas, APIs internas e layout)
├── components/          # Componentes compartilhados do design system
├── features/            # Slices Redux organizados por domínio
├── services/            # Serviços de acesso a dados e integrações
├── store/               # Configuração da store Redux Toolkit
└── utils/               # Funções utilitárias reutilizáveis
```

## Gerenciamento de estado com Redux
- A store está centralizada em [`src/store/index.ts`](src/store/index.ts).
- O domínio de transações está encapsulado em [`src/features/transactions/transactionSlice.ts`](src/features/transactions/transactionSlice.ts), utilizado pelas páginas de dashboard e extrato.
- Hooks tipados [`useAppDispatch` e `useAppSelector`](src/hooks/redux.ts) garantem segurança de tipos ao consumir o estado global.

## Microfrontends e evolução
A estratégia de microfrontends prevista para o projeto é detalhada em [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), cobrindo:
- modelo de composição via Module Federation com um host Next.js e remotes especializados;
- contratos de comunicação entre microfrontends para compartilhamento de estado e autenticação;
- responsabilidades de cada domínio (Dashboard, Transações, Configurações) e plano de deploy independente.

## Backend interno
O backend de apoio implementado com rotas API do Next.js possui instruções específicas em [`BACKEND_SETUP.md`](BACKEND_SETUP.md).
