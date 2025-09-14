<script lang="ts">
  import type { Snippet } from "svelte"

  type Props = {
    href: string
    target?: string
    rel?: string
    children: Snippet<[]>
  }

  let {
    href,
    target = "_blank",
    rel = "noopener noreferrer",
    children,
  }: Props = $props()
</script>

<a {href} {target} {rel}>
  {@render children()}
</a>

<style lang="scss">
  a {
    color: var(--accent-bright);
    padding: 0.5rem 1rem;
    padding-left: 0.75rem;
    border-radius: 0.5rem;
    font-weight: bold;
    border: 1px solid var(--border);
    transition: background-color 0.3s, color 0.3s;
    display: flex;
    align-items: center;
    gap: 0.25rem;

    &:hover {
      background-color: var(--selection);
      color: var(--text);
    }
  }
</style>
