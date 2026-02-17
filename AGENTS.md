# AGENTS.md

Instructions for AI agents working on this project.

## Project Overview

- **Framework:** Fresh (server-rendered Preact with islands architecture)
- **Runtime:** Deno
- **Styling:** Tailwind CSS + daisyUI 5
- **State Management:** @preact/signals
- **Deployment:** Deno Deploy (via GitHub Actions CI/CD)
- **Package Manager:** Deno (native, no npm/node)

## Available Commands

Always use Deno commands (never npm/node):

| Command                        | Description                                                   |
| ------------------------------ | ------------------------------------------------------------- |
| `deno task dev`                | Start development server                                      |
| `deno task build`              | Build for production                                          |
| `deno task start`              | Preview production build locally                              |
| `deno task preview:{dev,prod}` | Preview via Deno Deploy tunnel                                |
| `deno task check`              | **Run before every commit** - formats, lints, and type-checks |
| `deno deploy`                  | Manual deployment (usually handled by CI)                     |

## Git Workflow

### Pre-Commit Requirements

**ALWAYS run `deno task check` before committing.** This ensures:

- Code is properly formatted
- No lint errors
- TypeScript types are correct

### Commit Message Convention

Follow **Conventional Commits** specification:

```txt
<type>(<scope>): <description>

[optional body]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:

- `feat(og): add multiline text support`
- `fix: resolve hydration error in islands`
- `refactor(components): simplify button props`

## TypeScript Guidelines

### Type System: Open vs Closed Types

**Use `interface` (open types) for:**

- Props and component contracts
- Public APIs that may be extended
- When declaration merging is needed

```typescript
interface ButtonProps {
  label: string
  disabled?: boolean
}
```

**Use `type` with `&` and `|` (closed types) for:**

- Internal utility types
- Discriminated unions
- Complex transformations that shouldn't be extended

```typescript
type Result<T> = { success: true; data: T } | { success: false; error: string }
```

### Naming Conventions

- **PascalCase:** Types, interfaces, components (e.g., `User`, `ButtonProps`)
- **camelCase:** Variables, functions, properties (e.g., `fetchUsers`, `isActive`)
- **SCREAMING_SNAKE_CASE:** Constants (e.g., `MAX_RETRY_COUNT`, `API_BASE_URL`)

### Import Style

Use `@/` alias for local imports. Order: external → aliases → relative

```typescript
import { signal } from "@preact/signals"
import type { JSX } from "preact"

import type { Post } from "@/lib/types.ts"
import { fetchPosts } from "@/lib/posts.ts"
import Button from "@/components/Button.tsx"
```

### Promise Handling Style

**Prefer `.then()`, `.catch()`, `.finally()` over `async/await`**:

```typescript
fetchUsers()
  .then((users) => users.map((user) => user.name))
  .catch((error) => console.error("Failed:", error))
  .finally(() => console.log("Done"))
```

### Error Handling

Always handle errors in promise chains. Never silently ignore:

```typescript
fetchData()
  .then(processData)
  .catch((error) => {
    console.error("Processing failed:", error)
    throw error // Rethrow if needed
  })
```

## Component Guidelines

### File Organization

- **`components/`** - Presentational components (server-rendered only)
- **`islands/`** - Interactive components (client-side hydrated)
- **`routes/`** - Fresh route handlers and pages

### Component Declaration

Use `export default function` (not arrow functions):

```typescript
interface ButtonProps {
  label: string
  disabled?: boolean
  onClick?: () => void
}

export default function Button({ label, disabled = false, onClick }: ButtonProps) {
  return <button disabled={disabled} onclick={onClick}>{label}</button>
}
```

### Signal Usage

- **`signal()`** - Module-level for shared/global state
- **`useSignal()`** - Component-level for local interactive state (islands only)

```typescript
// Shared state - lib/state.ts
import { signal } from "@preact/signals"
export const globalCount = signal(0)

// Local state - islands only
import { useSignal } from "@preact/signals"
export default function Counter() {
  const clicks = useSignal(0)
  return <button onclick={() => clicks.value++}>{clicks.value}</button>
}
```

### Effects

Use `effect()` for side effects when signals change:

```typescript
import { effect, useSignal } from "@preact/signals"

export default function DataFetcher() {
  const userId = useSignal(1)
  const data = useSignal(null)

  effect(() => {
    fetch(`/api/users/${userId.value}`)
      .then((res) => res.json())
      .then((result) => {
        data.value = result
      })
  })

  return <div>{data.value}</div>
}
```

## Styling Guidelines

### daisyUI + Tailwind

- Use daisyUI semantic class names: `btn`, `card`, `badge`, `input`
- Use Tailwind utilities for customization: `btn px-10`
- Use `!` for specificity overrides (last resort): `btn bg-red-500!`

### Color System

Use daisyUI semantic colors (not Tailwind colors directly):

- `primary`, `secondary`, `accent` - Brand colors
- `base-100`, `base-200`, `base-300` - Surface colors
- `base-content` - Text on base
- `info`, `success`, `warning`, `error` - Semantic states
- `*-content` - Text on colored backgrounds

**Never use `text-gray-800` on `bg-base-100`** - it breaks dark mode.

### Responsive Design

Use Tailwind responsive prefixes with daisyUI classes:

```html
<div class="card sm:card-horizontal">
  <div class="menu sm:menu-horizontal">
```

## Data Fetching

- Fetch in route handlers, not components
- Pass data as props to components
- Keep data flow unidirectional: parent → child

```typescript
// routes/posts/[slug].tsx
export const handler = define.handlers({
  async GET(_ctx) {
    const posts = await fetchPosts()
    return page({ posts })
  }
})

export default define.page<typeof handler>(function Posts({ data }) {
  return <PostList posts={data.posts} />
})
```

## Comments & Documentation

- **Avoid obvious comments**
- Comment complex logic, non-obvious decisions, or important warnings
- Use JSDoc for public functions

```typescript
// Complex: explain the "why"
const getVisibleItems = (items: Item[]): Item[] => {
  // Filter by visibility and sort by priority to ensure important items show first
  return items
    .filter((item) => item.isVisible)
    .sort((a, b) => b.priority - a.priority)
}
```

## Quality Checklist (Before Every Commit)

- [ ] Run `deno task check` - passes format, lint, and type checks
- [ ] Commit message follows Conventional Commits
- [ ] No `console.log` debug statements left
- [ ] No unused imports or variables
- [ ] Proper error handling in promise chains
- [ ] Uses `@/` alias for local imports
- [ ] Components use proper TypeScript interfaces
- [ ] daisyUI classes used for components (not custom CSS)

## Build & Deployment

- Islands are automatically code-split and lazy-loaded
- Regular components are server-rendered (no JS sent to client)
- CI/CD auto-deploys on push to main
- Manual deploy: `deno deploy` (ensure all changes committed first)

## References

- [Fresh Docs](https://fresh.deno.dev/)
- [Preact Signals](https://preactjs.com/guide/v10/signals/)
- [daisyUI Components](https://daisyui.com/components/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Deno](https://docs.deno.com/)
