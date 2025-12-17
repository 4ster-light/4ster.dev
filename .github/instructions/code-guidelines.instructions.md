---
applyTo: "**/*.ts, **/*.tsx"
---

# **Project Overview**

This project uses:

- **Framework:** Fresh (server-rendered Preact with islands)
- **Runtime:** Deno
- **Styling:** Tailwind CSS + daisyUI 5
- **State Management:** @preact/signals
- **Deployment:** Deno Deploy (Cloudflare Pages)

---

# **TypeScript & General Coding Guidelines**

## **1. Type System: Open vs Closed Types**

**Use `interface` (open types) for:**

- Props and component contracts
- Public APIs that other code will extend or implement
- When you want extensibility via declaration merging
- Consumer code that needs flexibility

**Example - Open Type:**

```typescript
interface BaseButtonProps {
  label: string
  disabled?: boolean
}

interface PrimaryButtonProps extends BaseButtonProps {
  variant: "primary"
  size: "sm" | "md" | "lg"
}

// Easy for consumers to extend
interface CustomButtonProps extends PrimaryButtonProps {
  customAttr?: string
}
```

**Use `type` with `&` and `|` (closed types) for:**

- Internal utility types and compositions
- Type predicates and discriminated unions
- Complex transformations that shouldn't be extended
- When you want strict, immutable type definitions

**Example - Closed Type:**

```typescript
type Result<T> = { success: true; data: T } | { success: false; error: string }
type Validator<T> = (value: unknown) => T | Error
type Config = BaseConfig & FeatureConfig & SecurityConfig
```

## **2. Naming Conventions**

- Use **PascalCase** for types, interfaces, and components (e.g., `User`, `ButtonProps`)
- Use **camelCase** for variables, functions, and properties (e.g., `fetchUsers`, `isActive`)
- Use **SCREAMING_SNAKE_CASE** for constants (e.g., `MAX_RETRY_COUNT`, `API_BASE_URL`)

## **3. Imports & Exports**

- Use **the `@/` alias** for local imports (maps to `./`)
- Import from dependencies as specified in `deno.jsonc`
- Always use named imports for better tree-shaking and clarity
- Keep imports organized: external → aliases → relative

**Example:**

```typescript
import { signal } from "@preact/signals"
import type { JSX } from "preact"

import type { Post } from "@/lib/types.ts"
import { fetchPosts } from "@/lib/posts.ts"
import Button from "@/components/Button.tsx"
```

## **4. Async/Await vs Promises**

- **Prefer `.then()`, `.catch()`, and `.finally()`** over `async/await` blocks for promise handling
- Use `.map()`, `.filter()`, and other array methods for functional-style transformations

**Example:**

```typescript
fetchUsers()
  .then((users) => users.map((user) => user.name))
  .catch((error) => console.error("Failed to fetch users:", error))
  .finally(() => console.log("Request completed"))
```

## **5. Functional Style**

- **Chain methods** for readability and immutability
- Avoid mutable operations where possible
- Prefer `const` over `let` (immutability by default)

**Example:**

```typescript
const activeUserEmails = users
  .filter((user) => user.isActive)
  .map((user) => user.email)
```

## **6. Error Handling**

- **Always handle errors** in promise chains
- Use `.catch()` for side effects (e.g., logging) and rethrow if necessary
- Never silently ignore errors

**Example:**

```typescript
fetchData()
  .then(processData)
  .catch((error) => {
    console.error("Processing failed:", error)
    throw error // Rethrow to propagate
  })
```

## **7. Comments & Documentation**

- **Avoid obvious comments**, let the code speak for itself
- Use comments for **complex logic**, **non-obvious decisions**, or **important warnings**
- Use JSDoc for public functions and exports

**Example:**

```typescript
// Complex: explain the "why"
const getVisibleItems = (items: Item[]): Item[] => {
  // Filter by visibility and sort by priority to ensure important items show first
  return items
    .filter((item) => item.isVisible)
    .sort((a, b) => b.priority - a.priority)
}
```

## **8. Quality Assurance**

- Run **`deno task check`** before committing (formats, lints, and type-checks)
- Code is automatically deployed to **Deno Deploy** on push to main via CI/CD
- Follow **Conventional Commits** for meaningful commit history

---

# **Preact + Signals Component Guidelines**

Use Preact for components with TypeScript and JSX, leveraging `@preact/signals` for efficient
reactivity.

## **1. Component Structure**

- **Use `export default function`** for component declarations (not const arrow functions)
- **Keep components small and focused** on a single responsibility
- Use **`.tsx` files** for components with JSX
- Use **`.ts` files** for pure TypeScript utilities and state management
- Separate logic, markup, and styles clearly within the component

## **2. Props and State Management**

**Define props with `interface` and destructure directly in signature:**

```typescript
interface ButtonProps {
  label: string
  disabled?: boolean
  onClick?: () => void
}

export default function Button({ label, disabled = false, onClick }: ButtonProps) {
  return (
    <button disabled={disabled} onclick={onClick}>
      {label}
    </button>
  )
}
```

**Signal vs useSignal:**

- **`signal()`** - Module-level signals for shared/global state. Created outside components,
  persists across re-renders
- **`useSignal()`** - Component-level signals that are recreated on each component instance. Use in
  islands for local interactive state

**Use `signal()` for shared state (module-level):**

```typescript
// Shared across all component instances
import { signal } from "@preact/signals"

export const globalCount = signal(0)
```

**Use `useSignal()` for component-local state (islands):**

```typescript
import { useSignal } from "@preact/signals"

interface CounterProps {
  initialCount?: number
}

export default function Counter({ initialCount = 0 }: CounterProps) {
  // Each Counter instance gets its own signal
  const clicks = useSignal(initialCount)

  return (
    <button onclick={() => clicks.value++}>
      Clicked {clicks.value} times
    </button>
  )
}
```

## **3. Effects & Side Effects**

**Use `effect()` to run side effects when signals change:**

```typescript
import { effect, useSignal } from "@preact/signals"

export default function DataFetcher() {
  const userId = useSignal(1)
  const data = useSignal(null)
  const loading = useSignal(false)

  // Effect runs whenever userId changes
  effect(() => {
    loading.value = true
    fetch(`/api/users/${userId.value}`)
      .then((res) => res.json())
      .then((result) => {
        data.value = result
        loading.value = false
      })
      .catch((error) => {
        console.error("Fetch failed:", error)
        loading.value = false
      })
  })

  return (
    <>
      <button onclick={() => userId.value++}>Next User (ID: {userId})</button>
      {loading.value && <p>Loading...</p>}
      {data.value && <pre>{JSON.stringify(data.value, null, 2)}</pre>}
    </>
  )
}
```

**Effect cleanup (when using effect in components):**

```typescript
import { effect, useSignal } from "@preact/signals"

export default function LocationTracker() {
  const location = useSignal({ x: 0, y: 0 })

  effect(() => {
    // Effect logic
    const handleMouseMove = (e: MouseEvent) => {
      location.value = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Cleanup function: return a cleanup function if needed
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  })

  return <div>Position: ({location.value.x}, {location.value.y})</div>
}
```

## **4. Global & Shared State Management**

**Use `.ts` files with `signal()` for shared state (module-level):**

```typescript
// lib/state.ts
import { computed, signal } from "@preact/signals"

export interface Todo {
  id: string
  text: string
  done: boolean
}

export const todos = signal<Todo[]>([])
export const filter = signal<"all" | "active" | "completed">("all")

// Computed values are automatically updated when dependencies change
export const filteredTodos = computed(() => {
  const items = todos.value
  if (filter.value === "active") return items.filter((t) => !t.done)
  if (filter.value === "completed") return items.filter((t) => t.done)
  return items
})

export const activeCount = computed(() => todos.value.filter((t) => !t.done).length)
```

**Use in regular components (receives shared state as props):**

```typescript
import { activeCount, filteredTodos } from "@/lib/state.ts"

interface TodoListProps {
  todos: Todo[]
}

export default function TodoList({ todos }: TodoListProps) {
  return (
    <>
      <div>Active: {activeCount.value}</div>
      <ul>
        {todos.map((todo) => <li key={todo.id}>{todo.text}</li>)}
      </ul>
    </>
  )
}
```

**Use directly in islands (client-side interactive components):**

```typescript
import { filter, filteredTodos, todos } from "@/lib/state.ts"

export default function TodoListIsland() {
  return (
    <>
      <div>Active: {activeCount.value}</div>
      <ul>
        {filteredTodos.value.map((todo) => <li key={todo.id}>{todo.text}</li>)}
      </ul>
    </>
  )
}
```

## **5. Islands vs Regular Components**

**Islands** (in `islands/` folder):

- Interactive components that need client-side execution
- Can use `useSignal()` for local state and `effect()` for side effects
- Can access module-level `signal()` from shared state files
- Only islands are hydrated and sent to the client as JavaScript
- Example: `CopyAddressButton.tsx`, form inputs, interactive widgets

**Regular Components** (in `components/` folder):

- Presentational components rendered server-side
- Receive props from routes/islands
- Don't need interactivity (no signals needed)
- Can be reused in multiple places
- Server-rendered only (no JavaScript sent to client)
- Example: `Button.tsx`, `Card.tsx`, `PostMeta.tsx`

## **6. Important Considerations**

### **Fresh Server Rendering**

- Routes are server-rendered by default
- Only components in `routes/` and `islands/` are special
- Use `islands/` for client-side interactivity, `components/` for reusable UI

### **Styling with Tailwind + daisyUI**

- Use daisyUI class names for components (e.g., `btn`, `card`, `badge`)
- Combine with Tailwind utilities for customization
- Reference daisyUI documentation for available components
- Never use inline styles unless necessary

### **Signal Performance**

- Signals automatically track dependencies and re-render efficiently
- `computed()` values are lazy-evaluated and memoized
- Avoid creating signals inside component functions; declare at module level
- Signal changes trigger minimal re-renders (only affected components)

### **TypeScript in Fresh**

- Import `JSX` from `preact` for proper JSX typing if needed
- **Component return types are implicit** - no need for explicit `JSX.Element` or `: JSX.Element`
- Type all props with interfaces for better IDE support
- Destructure props directly in the function signature for cleaner code

### **Data Fetching**

- Fetch data in routes/server-side handlers, not in components
- Pass fetched data as props to components
- Use signals for client-side data mutations
- Keep the data flow unidirectional: parent → child

### **Build & Deployment**

- Islands are automatically code-split and lazy-loaded
- Regular components are pre-rendered on the server
- Run `deno task build` before testing production builds
- Deployment to Deno Deploy is automatic on push to main
