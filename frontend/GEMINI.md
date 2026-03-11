# GEMINI.md — Regras Obrigatórias para o Frontend (Next.js + React)

## Contexto

Este diretório contém o frontend da aplicação fullstack Notes, construído com Next.js, React e TypeScript.

---

## Regras Inegociáveis

### 1. Skill Obrigatória: `next-stack`

Antes de gerar **qualquer** código, componente, estilo ou configuração neste diretório, você **DEVE** obrigatoriamente:

1. **Ler o workflow `next-stack`** e identificar qual categoria se aplica ao contexto.
2. **Executar `view_file`** nos arquivos `SKILL.md` correspondentes dentro de `/home/drummonds/.gemini/antigravity/skills/`.
3. **Seguir estritamente** as diretrizes, padrões e restrições documentadas nessas Skills.

> ⛔ **NUNCA** gere código frontend baseado apenas no seu conhecimento pré-treinado genérico. As Skills locais são a fonte de verdade.

**Mapeamento de categorias para Skills locais:**

| Categoria | Skills para ler |
|:---|:---|
| UI/Componentes | `frontend-design/SKILL.md`, `react-best-practices/SKILL.md`, `react-patterns/SKILL.md` |
| Next.js/Routing/SSR | `nextjs-best-practices/SKILL.md`, `nextjs-app-router-patterns/SKILL.md` |
| Estilização | `tailwind-patterns/SKILL.md`, `ui-ux-pro-max/SKILL.md` |
| Formulários/CRO | `form-cro/SKILL.md` |
| SEO | `seo-audit/SKILL.md` |
| Segurança Frontend | `frontend-security-coder/SKILL.md`, `cc-skill-security-review/SKILL.md` |
| TypeScript | `typescript-expert/SKILL.md`, `javascript-pro/SKILL.md` |
| Design Premium | `frontend-developer/SKILL.md`, `mobile-design/SKILL.md`, `scroll-experience/SKILL.md` |

### 2. Padrões de Código

- **App Router** como padrão (não Pages Router).
- **Server Components** por padrão; `"use client"` apenas quando necessário.
- **TypeScript estrito** em todos os arquivos.
- Componentes focados e reutilizáveis.
