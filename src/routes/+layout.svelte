<script lang="ts">
  import "$lib/styles/typography.scss";
  import NavLink from "$lib/components/NavLink.svelte";
  import type { Snippet } from "svelte";

  type Props = {
    children: Snippet;
  };

  let { children }: Props = $props();
</script>

<div class="container">
  <header class="header">
    <nav class="nav">
      <a href="/" class="logo">✰λster✰</a>
      <div class="links">
        <NavLink href="https://twitter.com/4ster_light">X/Twitter</NavLink>
        <NavLink href="https://github.com/4ster-light">GitHub</NavLink>
        <a href="https://ko-fi.com/B0B41HVJUR" target="_blank"
          ><img
            height="36"
            style="border:0px;height:36px;"
            src="https://storage.ko-fi.com/cdn/kofi3.png?v=6"
            alt="Buy Me a Coffee at ko-fi.com"
          /></a
        >
      </div>
    </nav>
  </header>

  <main class="main">
    {@render children()}
  </main>

  <footer class="footer">
    <p>© {new Date().getFullYear()} ✰λster✰</p>
  </footer>
</div>

<style lang="scss">
  @use "$lib/styles/fonts";

  .container {
    max-width: 680px;
    margin: 0 auto;
    padding: 0 1rem;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .header {
    padding: 1.5rem 0;
    border-bottom: 1px solid var(--border);
    margin-bottom: 1.5rem;
  }

  .nav {
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 1rem;
    }

    .logo {
      margin: 0;
      font-size: 1.6rem;
      font-weight: 700;
      color: var(--accent-bright);
      font-family: fonts.$font-mono;

      &:hover {
        color: var(--accent);
      }
    }

    .links {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
  }

  .main {
    flex: 1;
  }

  .footer {
    border-top: 1px solid var(--border);
    padding: 1.5rem 0;
    text-align: center;
    color: var(--text-dim);
    margin-top: 2rem;
  }
</style>
