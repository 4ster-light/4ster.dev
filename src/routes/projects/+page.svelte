<script lang="ts">
  import type { PageProps } from "./$types"
  import type { RepositoryInfo } from "$lib/repositories"
  import Button from "$lib/components/Button.svelte"
  import LeftArrows from "$lib/assets/icons/LeftArrows.svg"
  import { BANNER_URL, KOFI_URL, PROJECTS_URL } from "$lib/urls"
  import PFP from "$lib/assets/pfp.jpg"
  import CreditCard from "$lib/assets/icons/CreditCard.svg"

  let { data }: PageProps = $props()
  const repos: RepositoryInfo[] = data.repos
</script>

<svelte:head>
  <meta name="author" content="David Vivar Bogónez" />
  <link rel="icon" href={PFP} />

  <title>Projects - ✰λster✰</title>
  <meta name="description" content="Open source projects by Aster" />

  <meta property="og:title" content="Projects" />
  <meta property="og:type" content="website" />
  <meta property="og:description" content="Open source projects by Aster" />
  <meta property="og:url" content={PROJECTS_URL} />
  <meta property="og:site_name" content="✰λster✰" />
  <meta property="og:locale" content="en_US">
  <meta property="og:image" content={BANNER_URL} />

  <meta name="twitter:title" content="Projects" />
  <meta name="twitter:description" content="Open source projects by Aster" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@4ster_light" />
  <meta name="twitter:image" content={BANNER_URL} />
  <meta property="twitter:image:height" content="600" />
  <meta property="twitter:image:width" content="1200" />
</svelte:head>

<section class="projects">
  <h2>Projects</h2>

  {#each repos as repo}
    <article class="project">
      <div class="project-header">
        <h3><a href="/projects/{repo.name}">{repo.name}</a></h3>
        <div class="project-stats">
          <span class="stat">{repo.stars} ⭐</span>
          <span class="stat">{repo.forks} forks</span>
        </div>
      </div>

      {#if repo.description}
        <p class="description">{repo.description}</p>
      {/if}

      <div class="project-meta">
        {#if repo.language}
          <span class="language">{repo.language}</span>
        {/if}
        <span class="updated">Updated {repo.updatedAt}</span>
        <a href={repo.url} target="_blank" rel="noopener" class="github-link">View on GitHub</a>
      </div>
    </article>
  {/each}

  <footer>
    <nav>
      <Button href="/" target="">
        <img src={LeftArrows} alt="Left Arrows" /> back
      </Button>
      <Button href={KOFI_URL}>
        <img src={CreditCard} alt="Support Me" /> Support Me
      </Button>
    </nav>
  </footer>
</section>

<style lang="scss">
  @use "$lib/styles/fonts";

  .projects {
    h2 {
      font-size: 1.6rem;
      margin-bottom: 1.5rem;
      color: var(--accent-bright);
    }

    .project {
      padding-bottom: 1.5rem;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--border);

      &:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }

      .project-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 0.5rem;
        gap: 1rem;

        @media (max-width: 768px) {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.3rem;
        }

        h3 {
          margin: 0;
          font-size: 1.1rem;

          a {
            color: var(--text);

            &:hover {
              color: var(--accent);
            }
          }
        }

        .project-stats {
          display: flex;
          gap: 1rem;
          flex-shrink: 0;

          .stat {
            font-family: fonts.$font-mono;
            font-size: 0.8rem;
            color: var(--text-dim);
            white-space: nowrap;
          }
        }
      }

      .description {
        margin: 0.5rem 0;
        font-size: 0.9rem;
        color: var(--text-muted);
      }

      .project-meta {
        font-family: fonts.$font-mono;
        display: flex;
        gap: 0.8rem;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 0.8rem;
        font-size: 0.75rem;

        .language {
          background: var(--bg-secondary);
          color: var(--text-dim);
          padding: 0.15rem 0.4rem;
          border-radius: 3px;
          border: 1px solid var(--border);
        }

        .updated {
          color: var(--text-dim);
        }

        .github-link {
          color: var(--accent);
          margin-left: auto;

          &:hover {
            color: var(--accent-bright);
          }
        }
      }
    }

    footer {
      nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }
</style>
