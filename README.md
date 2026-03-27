# NoteMaster - Fullstack Notes Application

Aplicativo completo de gerenciamento de notas construído em arquitetura monorepo com Spring Boot no backend e Next.js no frontend. 

## 🚀 Quick Start

> **Pré-requisitos:** Node.js 20+, Java 17+, Maven e Docker instalados.

**1. Suba a infraestrutura (PostgreSQL + Redis):**
```bash
docker compose up -d
```

**2. Inicie o Backend (Spring Boot):**
```bash
cd backend
mvn spring-boot:run
# A API estará rodando em http://localhost:8080/api/v1
```

**3. Inicie o Frontend (Next.js):**
```bash
cd frontend
npm install
npm run dev
# Acesse a interface em http://localhost:3000
```

## ✨ Features

- **Autenticação Segura:** Login, registro e renovação de sessão via JWT com HttpOnly Cookies usando a arquitetura Proxy do Next.js.
- **Gerenciamento de Notas:** Criação, leitura, edição (título, conteúdo e status de progresso) e deleção de notas.
- **Busca e Filtros Built-in:** Filtragem de notas por status e busca textual com debounce.
- **Rate Limiting:** Prevenção de abusos de API com Bucket4j e Redis.
- **Temas:** Suporte integral a Dark/Light mode com interface polida em Tailwind v4.
- **Design de Alta Qualidade:** UI Premium componentizada construída com Shadcn e Radix UI.

## 📦 Estrutura do Monorepo

| Diretório | Descrição | Stack |
|-----------|-------------|-------|
| [`/backend`](./backend/README.md) | API RESTful com arquitetura em camadas. | Java 17, Spring Boot 3.x, PostgreSQL, Redis |
| [`/frontend`](./frontend/README.md) | Aplicação client-side e server-side render. | Next.js 15, React 19, Tailwind v4, React Query |

Veja os links acima para documentações detalhadas sobre cada serviço.

## 🛠 Tech Stack e Dependências Principais

### Backend
- **Core:** Java 17, Spring Boot 3.5.11
- **Dados:** Spring Data JPA, PostgreSQL, Flyway (Migrações)
- **Segurança:** Spring Security, java-jwt (Auth0)
- **Resiliência:** Bucket4j, Jedis (Rate Limiting via Redis)
- **Documentação API:** Springdoc OpenAPI
- **Testes:** JUnit Jupiter, Testcontainers, Spring Security Test

### Frontend
- **Core:** Next.js 15.5.12 (App Router), React 19, TypeScript 5
- **Rede e Estado:** Axios, @tanstack/react-query 
- **Estilização/UI:** Tailwind CSS v4, shadcn/ui, class-variance-authority, lucide-react, next-themes
- **Notificações:** Sonner

## 📖 Documentação Adicional

Acesse nossos READMEs modulares para aprofundamento técnico em API e Interface:

- [Documentação do Backend](./backend/README.md)
- [Documentação do Frontend](./frontend/README.md)

## 📄 License

GPL-3.0 License
