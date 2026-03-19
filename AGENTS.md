# AGENTS.md

This document provides guidelines for AI coding agents working on this repository.

## Project Overview

Full-stack Notes application with:
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, TailwindCSS v4, shadcn/ui
- **Backend**: Spring Boot 3.5.11, Java 17, PostgreSQL 15

---

## Build/Lint/Test Commands

### Frontend (from `frontend/` directory)

```bash
# Development
npm run dev              # Start dev server with Turbopack on http://localhost:3000

# Build
npm run build            # Production build with Turbopack
npm run start            # Start production server

# Linting
npm run lint             # Run ESLint with next/core-web-vitals and next/typescript

# Run a single test (no test framework configured yet - suggest adding Vitest)
# Until then, use type checking:
npx tsc --noEmit         # TypeScript type checking
```

### Backend (from repository root)

```bash
# Maven commands
mvn clean install        # Build the project
mvn test                 # Run all tests
mvn spring-boot:run       # Start Spring Boot application on port 8080

# Run a single test class
mvn test -Dtest=ClassName
mvn test -Dtest=ClassName#methodName

# Docker
docker compose up -d     # Start PostgreSQL and all services
```

---

## Code Style Guidelines

### TypeScript/JavaScript

1. **Strict Mode**: TypeScript strict mode is enabled (`tsconfig.json`).
2. **No Implicit Any**: Avoid `any` types; use `unknown` when type is truly unknown.
3. **Prefer Named Exports**: Use named exports over default exports for better refactoring.

```typescript
// Good
export { Button, buttonVariants };
export function Card() {}

// Avoid
export default function Card() {}
```

### File Naming Conventions

| File Type | Convention | Example |
|-----------|------------|---------|
| Components | PascalCase | `Button.tsx`, `LoginForm.tsx` |
| Pages | kebab-case with `page.tsx` | `login/page.tsx`, `notes/[id]/page.tsx` |
| Layouts | `layout.tsx` | `app/layout.tsx` |
| Utilities | kebab-case | `api-server.ts`, `utils.ts` |
| Hooks | camelCase with `use` prefix | `useAuth.ts` |
| API libs | kebab-case | `axios.ts`, `api-server.ts` |

### Import Organization

Order imports as follows:

```typescript
// 1. React/core imports
import * as React from "react";

// 2. Third-party imports (grouped by library)
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// 3. UI components (shadcn/ui)
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// 4. Internal modules
import { getMockServerData } from "@/lib/api-server";
```

### Path Aliases

Use `@/` prefix for all internal imports:

```typescript
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import styles from "@/styles/button.module.css";
```

The alias maps to `./src/*` as configured in `tsconfig.json`.

### Component Patterns

#### Server vs Client Components

- **Default**: Server Components (no directive)
- **Use `"use client"`**: Only when you need client-side interactivity (hooks, event handlers, browser APIs)

```typescript
// Server Component (default)
export function LoginPage() {
  const data = await fetchData();
  return <LoginForm initialData={data} />;
}

// Client Component
'use client';

import { useState } from 'react';
export function LoginForm() {
  const [email, setEmail] = useState('');
  // ...
}
```

#### UI Components (shadcn/ui)

Follow the existing shadcn/ui pattern:

```typescript
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva("base-classes", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/80",
      destructive: "bg-destructive text-destructive-foreground",
    },
    size: {
      default: "h-9 px-4 py-2",
      sm: "h-8 px-3",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
```

#### Data Attributes

Use `data-slot` and `data-*` attributes for styling variants and states:

```tsx
<div data-slot="card" data-size="sm">
<div data-slot="card-header">
<button data-variant="default" data-size="sm">
```

### Styling Guidelines

1. **TailwindCSS v4**: Use utility classes with CSS variables.
2. **CSS Variables**: Use design tokens from `globals.css`:
   - Colors: `bg-primary`, `text-foreground`, `border-border`
   - Spacing: Use Tailwind spacing scale
   - Shadows: `shadow-sm`, `shadow-md`, etc.
3. **oklch Colors**: Use oklch color format for theming consistency.

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Variables | camelCase | `isLoading`, `userData` |
| Functions | camelCase | `handleSubmit`, `fetchData` |
| Components | PascalCase | `LoginForm`, `NoteCard` |
| Types/Interfaces | PascalCase | `LoginFormProps`, `UserData` |
| Constants | SCREAMING_SNAKE | `API_BASE_URL` |
| CSS Variables | kebab-case | `--background`, `--foreground` |
| Tailwind classes | kebab-case | `bg-primary`, `text-foreground` |

### Error Handling

- Use try/catch for async operations
- Handle API errors gracefully with user feedback
- Type errors properly (avoid `any`)

```typescript
try {
  const response = await api.post('/login', credentials);
  return response.data;
} catch (error) {
  if (axios.isAxiosError(error)) {
    toast.error(error.response?.data?.message || 'Login failed');
  }
  throw error;
}
```

---

## Framework-Specific Guidelines

### Next.js 15 App Router

1. Use **Server Components** by default for data fetching
2. Use **React Query** for client-side data fetching and caching
3. Keep pages focused; extract logic to hooks or modules
4. Use `loading.tsx` and `error.tsx` for route-level loading/error states

### React Query (TanStack Query v5)

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['notes'],
  queryFn: () => api.get('/notes'),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### TailwindCSS v4

Import pattern:
```css
@import "tailwindcss";
```

Use `@apply` sparingly in `globals.css`:
```css
@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

---

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx           # Home page
│   │   ├── globals.css        # Global styles
│   │   └── login/page.tsx     # Route pages
│   ├── components/
│   │   └── ui/                # shadcn/ui components
│   ├── lib/
│   │   ├── utils.ts           # cn() utility
│   │   ├── axios.ts           # Axios instance
│   │   └── api-server.ts     # Server-side helpers
│   ├── modules/               # Feature modules
│   │   └── auth/
│   │       └── components/
│   └── providers/             # React providers
├── components.json            # shadcn/ui config
├── tsconfig.json
├── eslint.config.mjs
└── package.json

backend/
├── src/main/java/com/notes/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── model/
│   └── config/
├── src/main/resources/
│   └── db/migration/          # Flyway migrations
└── pom.xml
```

---

## API Conventions

- Base URL: `http://localhost:8080/api` (configurable via `NEXT_PUBLIC_API_URL`)
- API prefix: `/api/v1`
- Use Axios interceptors for auth tokens
- Response format: JSON

---

## Key Dependencies

### Frontend
- `next`: 15.5.12
- `react`: 19.1.0
- `@tanstack/react-query`: ^5.90.21
- `tailwindcss`: ^4
- `shadcn`: ^4.0.6
- `class-variance-authority`: ^0.7.1
- `lucide-react`: ^0.577.0
- `sonner`: ^2.0.7

### Backend
- Spring Boot: 3.5.11
- Java: 17
- Database: PostgreSQL 15
- Auth: JWT (java-jwt)
- Migrations: Flyway

---

## Important Notes

1. **Read GEMINI.md**: The frontend has mandatory skill requirements documented in `/frontend/GEMINI.md`. Before generating frontend code, read relevant skills from `/home/drummonds/.gemini/antigravity/skills/`.

2. **No Prettier Config**: This project does not use Prettier. ESLint is the only linter configured.

3. **Dark Mode**: Use `.dark` class on `<html>` element. CSS variables support both light and dark themes.

4. **Type Safety**: Avoid `any`. Use `unknown` and proper type guards when necessary.

5. **Accessibility**: Use semantic HTML, proper ARIA attributes, and keyboard navigation support.
