<script lang="ts">
  import "$lib/styles/typography.scss"
  import NavLink from "$lib/components/NavLink.svelte"
  import Button from "$lib/components/Button.svelte"
  import { GITHUB_URL, KOFI_URL, PROJECTS_URL, X_URL } from "$lib/urls"
  import GitHub from "$lib/assets/icons/GitHub.svg"
  import Twitter from "$lib/assets/icons/Twitter.svg"
  import Code from "$lib/assets/icons/Code.svg"
  import CreditCard from "$lib/assets/icons/CreditCard.svg"
  import { afterNavigate } from "$app/navigation"

  let { children } = $props()
  let isMenuOpen = $state(false)

  afterNavigate(() => (isMenuOpen = false))
</script>

<div class="container">
  <header>
    <nav>
      <a href="/" class="logo">✰λster✰</a>

      <button
        class="menu-toggle"
        onclick={() => (isMenuOpen = !isMenuOpen)}
        aria-label="Toggle menu"
        class:active={isMenuOpen}
      >
        <span class="hamburger"></span>
        <span class="hamburger"></span>
        <span class="hamburger"></span>
      </button>

      <div class="links" class:open={isMenuOpen}>
        <NavLink href={X_URL}>
          <img src={Twitter} alt="Twitter" /> Twitter
        </NavLink>
        <NavLink href={GITHUB_URL}>
          <img src={GitHub} alt="GitHub" /> GitHub
        </NavLink>
        <NavLink href={PROJECTS_URL} target="">
          <img src={Code} alt="Code" /> Projects
        </NavLink>
        <Button href={KOFI_URL}>
          <img src={CreditCard} alt="Support Me" /> Support Me
        </Button>
      </div>
    </nav>
  </header>

  <main>
    {@render children()}
  </main>

  <footer>
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

    header {
      padding: 1.5rem 0;
      border-bottom: 1px solid var(--border);
      margin-bottom: 1.5rem;
    }

    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;

      .logo {
        margin: 0;
        font-size: 1.6rem;
        font-weight: 700;
        color: var(--accent-bright);
        font-family: fonts.$font-mono;
        z-index: 10;
        position: relative;

        &:hover {
          color: var(--accent);
        }
      }

      .menu-toggle {
        display: none;
        flex-direction: column;
        background: none;
        border: none;
        cursor: pointer;
        z-index: 10;
        position: relative;

        .hamburger {
          width: 20px;
          height: 2px;
          background-color: var(--text);
          margin: 2px 0;
          transition: 0.3s;
          border-radius: 1px;
        }

        @media (max-width: 768px) {
          display: flex;
        }
      }

      .links {
        display: flex;
        align-items: center;
        gap: 1.5rem;

        @media (max-width: 768px) {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          padding: 1rem;
          flex-direction: column;
          gap: 1rem;
          transform: translateY(-10px);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          z-index: 5;

          &.open {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
          }
        }

        @media (max-width: 480px) {
          gap: 0.8rem;
          padding: 0.8rem;
        }
      }
    }

    main {
      flex: 1;
    }

    footer {
      border-top: 1px solid var(--border);
      padding: 1.5rem 0;
      text-align: center;
      color: var(--text-dim);
      margin-top: 2rem;
    }
  }

  // Hamburger animation
  .menu-toggle.active {
    .hamburger:nth-child(1) {
      transform: rotate(-45deg) translate(-4px, 4.5px);
    }
    .hamburger:nth-child(2) {
      opacity: 0;
    }
    .hamburger:nth-child(3) {
      transform: rotate(45deg) translate(-4px, -4.5px);
    }
  }
</style>
