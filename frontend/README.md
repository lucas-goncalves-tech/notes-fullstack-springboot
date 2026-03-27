# NoteMaster - Frontend UI

A interface moderna e interativa de gerenciamento de notas construída com Next.js v15 e Tailwind v4.

## 🚀 Quick Start

**1. Configuração de Dependências**
```bash
npm install
```

**2. Variáveis de Ambiente**
Crie um arquivo `.env` a partir do modelo local e preencha a Base API.
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

**3. Iniciando Ambiente de Desenvolvimento**
```bash
npm run dev
# Turbopack habilitado; servidor disponível em http://localhost:3000
```

## ✨ Arquitetura & Features

- **App Router (React Server Components):** Usa Server Actions nas estruturas de componentes, mesclando eficientemente com bibliotecas hidratadas (`"use client"`).
- **Gerenciamento de Cache via React Query:** Mutação e Fetch do DB lidam com dados assíncronos suavemente, desabilitando o "loading" falso de UX.
- **Proxy Patterns em Rotas Auth:** Contorna a limitação clássica de cookies _HttpOnly_ de domínios diferentes. Exatamente o Refresh e Login são intermediados na pasta `app/api/auth/[...]`.
- **Acessibilidade Shadcn:** Componentes headless (`Radix UI`) com tipagem reforçada e personalizações nativas.
- **Modos Claro/Escuro Embutido:** Suportado com `next-themes`, mudando classes diretamente em estado. 

## ⚙️ Core Scripts Disponíveis

| Comando | Descrição |
|----------|-------------|
| `npm run dev` | Inicia para desenvolvimento ágil utilizando `--turbopack`. |
| `npm run lint` | Escaneia por defeitos usando ESLint (Next e Typescript rules). |
| `npx tsc --noEmit` | Examina falhas silenciosas de tipagem em todo projeto. |
| `npm run build` | Produz o bundle de Deploy Final. |

## 📚 Estrutura de Diretórios 

```markdown
frontend/
├── src/
│   ├── app/                    # Next.js App Router raiz e API proxy routes
│   │   ├── (protected)/        # Rotas em layout trancadas pelo sistema auth
│   │   └── api/auth/           # Rotas Bff para gerenciamento do cookie HttpOnly
│   ├── components/
│   │   └── ui/                 # Componentes genéricos providos via Shadcn
│   ├── lib/                    # Helpers, Cn e utilitários da instânica global de Axios 
│   ├── modules/                # Recursos de alto nível separados por Feature (Auth / Notes)
│   └── providers/              # Componentes de provedor HOC (Temas e Sessões Query/Auth)
└── components.json             # Root Config das classes Shadcn.
```

## 🛠 Design Adicional e Contribuição
Se você deseja adicionar um novo formulário ou card à biblioteca, gere utilizando o CLI do shadcn previamente. Exemplo: `npx shadcn@latest add dialog`

Use as variáveis semânticas do Tailwind do `globals.css` (ex. `bg-background`, `text-foreground`, `bg-primary`, `border-border`) ao invés das cores padronizadas em Slate para assegurar compatibilidade absoluta com o Tema!

## 📄 License
Totalmente Open Source sob GPL-3.0 License.
