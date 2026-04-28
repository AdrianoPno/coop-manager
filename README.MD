# Coop Manager

![Coop Manager](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=nodedotjs)
![Firebase](https://img.shields.io/badge/Firebase-auth%20&%20firestore-orange?logo=firebase)

Um sistema de gerenciamento robusto e escalável para cooperativas, construído com uma arquitetura moderna de separação entre backend e frontend, focado em segurança, performance e manutenibilidade.

## ✨ Principais Funcionalidades

- **Painel de Controle Estratégico**: Dashboard com KPIs em tempo real sobre cooperados, alertas de conformidade e tendências de crescimento.
- **Gestão Multi-Unidade**: Arquitetura multi-tenant onde `SUPER` administradores gerenciam unidades de negócio e `ADMINS` gerenciam os dados de suas respectivas unidades.
- **Controle de Acesso Baseado em Papéis (RBAC)**: Sistema de permissões claro e seguro com três níveis: `SUPER`, `ADMIN` e `USER`.
- **Gerenciamento Completo**: Módulos dedicados para gerenciar Cooperados, Unidades e Usuários com operações de CRUD (Create, Read, Update, Delete).
- **Segurança Integrada**: Validação de entrada em todas as rotas da API, proteção contra acesso indevido a dados de outras unidades e transações atômicas para garantir a integridade dos dados.

---

## 🚀 Tecnologias Utilizadas

O projeto é um monorepo dividido em duas aplicações principais:

### Backend

| Tecnologia             | Descrição                                                                                               |
| :--------------------- | :------------------------------------------------------------------------------------------------------ |
| **Node.js / Express**  | Ambiente de execução e framework para construção da API REST.                                           |
| **TypeScript**         | Garante a tipagem e a robustez do código.                                                               |
| **Firebase**           | Utilizado para **Authentication** (gerenciamento de tokens JWT) e **Firestore** (banco de dados NoSQL). |
| **Zod**                | Validação de schemas para garantir que os dados que entram na API sejam seguros e bem formatados.       |
| **Swagger (OpenAPI)**  | Documentação interativa da API, gerada automaticamente a partir do código.                              |
| **Helmet**             | Middleware de segurança que adiciona cabeçalhos HTTP para proteção contra vulnerabilidades comuns.      |
| **Express Rate Limit** | Proteção contra ataques de força bruta através da limitação de requisições por IP.                      |
| **Pino**               | Logger estruturado de alta performance para monitoramento e depuração em produção.                      |
| **CORS**               | Configurado para permitir comunicação segura com o frontend.                                            |

### Frontend

| Tecnologia            | Descrição                                                                                   |
| :-------------------- | :------------------------------------------------------------------------------------------ |
| **React / Vite**      | Biblioteca para construção da interface e ambiente de desenvolvimento de alta performance.  |
| **TypeScript**        | Tipagem estrita para componentes e lógica de negócio.                                       |
| **Material-UI (MUI)** | Biblioteca de componentes e sistema de design para uma UI coesa e profissional.             |
| **TanStack Query**    | Gerenciamento de estado do servidor (caching, revalidação e sincronização de dados da API). |
| **Zustand**           | Gerenciamento de estado global do cliente (ex: dados do usuário autenticado).               |
| **React Hook Form**   | Gerenciamento de formulários performático e flexível.                                       |
| **React Router**      | Gerenciamento de rotas da aplicação.                                                        |

---

## ⚙️ Instalação e Execução

### Pré-requisitos

- **Node.js**: Versão 18 ou superior.
- **NPM** ou **Yarn**.
- Um projeto **Firebase** configurado no console do Google Cloud.

### 1. Configuração do Backend

a. Navegue até a pasta do backend:

```bash
cd backend
```

b. Instale as dependências:

```bash
npm install
```

c. Configure as variáveis de ambiente. Crie um arquivo `.env` na raiz da pasta `backend` a partir do exemplo:

```bash
# Exemplo de .env
PORT=3001
```

d. Configure as credenciais do Firebase. Baixe o arquivo JSON da sua conta de serviço no console do Firebase e salve-o como `serviceAccountKey.json` na raiz da pasta `backend`.

### 2. Configuração do Frontend

a. Navegue até a pasta do frontend:

```bash
cd frontend
```

b. Instale as dependências:

```bash
npm install
```

c. Configure as variáveis de ambiente. Crie um arquivo `.env.local` na raiz da pasta `frontend` com as credenciais do seu cliente web do Firebase:

```bash
# .env.local
VITE_FIREBASE_API_KEY="sua-api-key"
VITE_FIREBASE_AUTH_DOMAIN="seu-auth-domain"
VITE_FIREBASE_PROJECT_ID="seu-project-id"
VITE_FIREBASE_STORAGE_BUCKET="seu-storage-bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID="seu-sender-id"
VITE_FIREBASE_APP_ID="seu-app-id"
```

### 3. Executando a Aplicação

A partir da pasta raiz do projeto (`coop-manager`), você pode usar os scripts para iniciar ambos os servidores simultaneamente.

a. Iniciar o servidor de backend:

```bash
npm run dev:back
```

b. Em um novo terminal, iniciar o servidor de frontend:

```bash
npm run dev:front
```

- O **Frontend** estará disponível em `http://localhost:5173`.
- O **Backend** estará disponível em `http://localhost:3001`.

---

## 📚 Documentação da API

A documentação completa e interativa da API, gerada com Swagger, está disponível em:

**http://localhost:3001/api-docs**

---

## 🛡️ Destaques de Segurança

A segurança é um pilar fundamental deste projeto, implementada através de:

- **Controle de Acesso (RBAC)**: Middlewares no backend (`checkRoles`) e lógica no frontend garantem que as ações e visualizações de dados respeitem a hierarquia de permissões.
- **Isolamento de Dados (Multi-tenancy)**: A lógica nos serviços do backend assegura que um `ADMIN` só possa operar sobre os dados de sua própria unidade, prevenindo vazamento de informações.
- **Validação de Entrada**: Todas as requisições que modificam dados são validadas com Zod, mitigando riscos de injeção e dados corrompidos.
- **Proteção de API**: Implementação de `Rate Limiting` para prevenir ataques de força bruta e `Helmet` para adicionar uma camada de segurança nos cabeçalhos HTTP.
- **Transações Atômicas**: Operações críticas, como a criação de usuários, utilizam um padrão de "Auth First + Rollback", garantindo que o sistema não fique em um estado inconsistente.
- **Logging Estruturado**: Utilização do Pino para gerar logs em formato JSON, facilitando o monitoramento, a análise de segurança e a depuração em ambientes de produção.

---

## 🤝 Contribuição

Contribuições são bem-vindas! Para sugestões, melhorias ou correções de bugs, por favor, abra uma _Issue_ ou envie um _Pull Request_.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
