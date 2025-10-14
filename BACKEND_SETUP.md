# Configuração do Backend Interno
## Instalação das Dependências

Execute o seguinte comando para instalar as dependências necessárias:

```bash
yarn add bcryptjs jsonwebtoken @types/bcryptjs @types/jsonwebtoken
```

ou

```bash
npm install bcryptjs jsonwebtoken @types/bcryptjs @types/jsonwebtoken
```

## Configuração do Ambiente

Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```env
# JWT Secret Key - Change this in production!
JWT_SECRET=your-super-secret-jwt-key

# Database URL (for future use with a real database)
# DATABASE_URL=postgresql://username:password@localhost:5432/bytebank
```

## Endpoints Disponíveis

### Autenticação
- `POST /api/user` - Criar novo usuário
- `POST /api/user/auth` - Fazer login

### Conta
- `GET /api/account` - Buscar dados da conta (requer autenticação)
- `GET /api/account/[accountId]/statement` - Buscar extrato da conta (requer autenticação)

## Funcionalidades Implementadas

### Autenticação
- Cadastro de usuários com validação
- Login com JWT
- Hash de senhas com bcrypt
- Verificação de token JWT

### Conta Bancária
- Criação automática de conta para novos usuários
- Saldo inicial de R$ 1.000,00
- Número de conta único

### Extrato
- Transações de exemplo para demonstração
- Histórico ordenado por data

## Banco de Dados

Atualmente, o sistema usa armazenamento em memória (arrays JavaScript).

## Segurança

- Senhas são hasheadas com bcrypt
- Tokens JWT com expiração de 24h
- Validação de entrada em todos os endpoints
- Verificação de autenticação para endpoints protegidos

## Executando o Projeto

```bash
yarn dev
```

O backend estará disponível em `http://localhost:3000/api`
