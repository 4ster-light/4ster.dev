<script lang="ts">
  import type { PageProps } from "./$types"
  import type { Repository } from "$lib/repositories"
  import { BANNER_URL, DONATE_URL, URL } from "$lib/urls"
  import PFP from "$lib/assets/pfp.jpg"
  import Button from "$lib/components/Button.svelte"
  import LeftArrows from "$lib/assets/icons/LeftArrows.svg"
  import CreditCard from "$lib/assets/icons/CreditCard.svg"

  let { data }: PageProps = $props()
  const repository: Repository = data.repository
</script>

<svelte:head>
  <meta name="author" content="David Vivar Bogónez" />
  <link rel="icon" href={PFP} />

  <title>{repository.name} - ✰λster✰</title>
  <meta
    name="description"
    content={repository.description || `${repository.name} - Open source project`}
  />

  <meta property="og:title" content={repository.name} />
  <meta property="og:type" content="website" />
  <meta
    property="og:description"
    content={repository.description || `${repository.name} - Open source project`}
  />
  <meta property="og:url" content={repository.url} />
  <meta property="og:site_name" content="✰λster✰" />
  <meta property="og:locale" content="en_US">
  <meta property="og:image" content={BANNER_URL} />

  <meta name="twitter:title" content={repository.name} />
  <meta
    name="twitter:description"
    content={repository.description || `${repository.name} - Open source project`}
  />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@4ster_light" />
  <meta name="twitter:image" content={BANNER_URL} />
  <meta property="twitter:image:height" content="600" />
  <meta property="twitter:image:width" content="1200" />
</svelte:head>

<article class="project">
  <header>
    <h1>{repository.name}</h1>
    <div class="project-meta">
      <div class="stats">
        <span class="stat">{repository.stars} stars</span>
        <span class="stat">{repository.forks} forks</span>
        {#if repository.language}
          <span class="language">{repository.language}</span>
        {/if}
      </div>
      <time class="updated">Updated {repository.updated_at}</time>
    </div>
  </header>

  <div class="content">
    {#if repository.description}
      <p class="description">{repository.description}</p>
    {:else}
      <p class="description">Open source project by Aster.</p>
    {/if}

    <div class="project-info">
      <h3>Repository Information</h3>
      <table>
        <tbody>
          <tr>
            <th>Language</th>
            <td>{repository.language || "Not specified"}</td>
          </tr>
          <tr>
            <th>Stars</th>
            <td>{repository.stars}</td>
          </tr>
          <tr>
            <th>Forks</th>
            <td>{repository.forks}</td>
          </tr>
          <tr>
            <th>Last Updated</th>
            <td>{repository.updated_at}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="actions">
      <a href={repository.url} target="_blank" rel="noopener" class="github-button">
        View on GitHub
      </a>
    </div>
  </div>

  <footer>
    <nav>
      <Button href={URL} target="">
        <img src={LeftArrows} alt="Left Arrows" /> back
      </Button>
      <Button href={DONATE_URL}>
        <img src={CreditCard} alt="Support Me" /> Support Me
      </Button>
    </nav>
  </footer>
</article>

<style lang="scss">
  @use "$lib/styles/fonts";

  .project {
    margin-bottom: 2rem;

    header {
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border);

      h1 {
        font-size: 2.75rem;
        margin-bottom: 0.8rem;
        line-height: 1.2;

        @media (max-width: 768px) {
          font-size: 2rem;
        }
      }

      .project-meta {
        font-family: fonts.$font-mono;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;

        @media (max-width: 768px) {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .stats {
          display: flex;
          gap: 1rem;
          align-items: center;

          .stat {
            color: var(--text-dim);
            font-size: 0.8rem;
          }

          .language {
            background: var(--bg-secondary);
            color: var(--text-dim);
            padding: 0.15rem 0.4rem;
            border-radius: 3px;
            font-size: 0.75rem;
            border: 1px solid var(--border);
          }
        }

        .updated {
          color: var(--text-dim);
          font-size: 0.8rem;
        }
      }
    }

    .content {
      .description {
        font-size: 1.1rem;
        line-height: 1.6;
        margin-bottom: 2rem;
        color: var(--text-muted);
      }

      .project-info {
        margin-bottom: 2rem;

        h3 {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          color: var(--text);
        }
      }

      .actions {
        margin-top: 2rem;

        .github-button {
          background-color: var(--bg-secondary);
          color: var(--accent-bright);
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-weight: bold;
          border: 1px solid var(--border);
          transition: background-color 0.3s, color 0.3s;

          &:hover {
            background-color: var(--accent-dim);
            color: var(--text);
          }
        }
      }
    }

    footer {
      nav {
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--border);
        display: flex;
        justify-content: space-between;
      }
    }
  }
</style>
