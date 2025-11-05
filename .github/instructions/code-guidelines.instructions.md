---
applyTo: "**/*.ts, **/*.svelte.ts, **/*.svelte"
---

# **TypeScript Coding Guidelines**

## **1. Type Definitions**

- **Prefer `type` over `interface`** for defining types.
- **Use `&` for type composition** instead of `extends` or `implements`.
- Avoid `interface` unless required for third-party libraries or declaration merging.

**Example:**

```typescript
type User = {
  id: string
  name: string
}

type Admin = User & {
  role: "admin"
  permissions: string[]
}
```

## **2. Async/Await vs Promises**

- **Prefer `.then()`, `.catch()`, and `.finally()`** over `async/await` blocks for promise handling.
- Use `.map()`, `.filter()`, and other array methods for functional-style transformations.

**Example:**

```typescript
fetchUsers()
  .then((users) => users.map((user) => user.name))
  .catch((error) => console.error("Failed to fetch users:", error))
  .finally(() => console.log("Request completed"))
```

## **3. Functional Style**

- **Chain methods** for readability and immutability.
- Avoid mutable operations where possible.

**Example:**

```typescript
const activeUserEmails = users
  .filter((user) => user.isActive)
  .map((user) => user.email)
```

## **4. Naming Conventions**

- Use **PascalCase** for types (e.g., `type User`).
- Use **camelCase** for variables and functions (e.g., `fetchUsers`).

## **5. Imports**

- Use **absolute paths** for local imports where possible, keeping in mind SvelteKit specific
  aliases like `$lib` and `./$types` and such.

**Example:**

```typescript
import adapter from "@sveltejs/adapter-cloudflare"
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"
import type { Config } from "@sveltejs/kit"
import type { User } from "$lib/types/user"
```

## **6. Error Handling**

- **Always handle errors** in promise chains.
- Use `.catch()` for side effects (e.g., logging) and rethrow if necessary.

**Example:**

```typescript
fetchData()
  .then(processData)
  .catch((error) => {
    logError(error)
    throw error // Rethrow if needed
  })
```

## **7. Comments**

- **Avoid obvious comments**, let the code speak for itself.
- Use comments for **complex logic** or **non-obvious decisions**.

## **8. Linting & Formatting**

- Use **Deno’s built-in linter and formatter** (`deno lint` and `deno fmt`).
- Enforce consistency with `deno task check`.

---

# **Svelte Coding Guidelines**

Always use the API's and Runes of Svelte 5 like `$props()`, `$state()`, `$derived()`, and so on.

## **1. Component Structure**

- **Keep components small and focused** on a single responsibility.
- Use **`<script lang="ts">`** for TypeScript support.
- Separate logic, markup, and styles clearly within the component.
- Use **`<style lang="scss">`** for component-specific styles.

## **2. Props and State Management**

- Define **props with `$props()`** and type them explicitly with `type Props {}`.

**Example:**

```svelte
<script lang="ts">
  type Props = {
    title: string
    isActive: boolean
  }

  let { title, isActive }: Props = $props()
</script>

<h1 class:is-active={isActive}>{title}</h1>
```

- Use **`$state()`** for local component state.

**Example:**

```svelte
<script lang="ts">
  type Props = {
    count: number
  }

  let { count }: Props = $props()
  let state = $state({ clicks: 0 })
</script>

<button onclick={() => state.clicks++}>
  Clicked {state.clicks} times
</button>
```

- Also use **`$derived()`** for derived state.

**Example:**

```svelte
<script lang="ts">
  type Props = {
    items: string[]
  }

  let { items }: Props = $props()
  let derived = $derived(() => items.length)
</script>

<p>Total items: {derived}</p>
```

- And finally use `*.svelte.ts` files for shared state management through the `$state()` rune.
