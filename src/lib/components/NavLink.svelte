<script lang="ts">
  import type { Snippet } from "svelte";

  type Props = {
    href: string;
    class?: string;
    target?: string;
    rel?: string;
    children: Snippet;
  };

  let {
    href,
    target = "_blank",
    rel = "noopener noreferrer",
    children,
  }: Props = $props();
</script>

<a {href} {target} {rel} class="nav-link">
  {@render children()}
</a>

<style lang="scss">
  @use "$lib/styles/fonts";
  
  a {
    font-family: fonts.$font-mono;
    color: var(--text-dim);
    font-size: 1rem;
    position: relative;
    transition: color 0.2s ease;

    &:hover {
      color: var(--accent);
    }

    // Animated underline
    &::after {
      content: "";
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 1px;
      background: var(--accent-bright);
      transition: width 0.3s ease;
    }

    &:hover::after {
      width: 100%;
    }
  }
</style>
