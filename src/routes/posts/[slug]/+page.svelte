<script lang="ts">
  import PostMeta from "$lib/components/PostMeta.svelte"
  import SupportButton from "$lib/components/SupportButton.svelte"
  import type { Post } from "$lib/posts"
  import type { PageProps } from "./$types"
  import { BANNER_URL, POSTS_URL } from "$lib/urls"
  import PFP from "$lib/assets/pfp.jpg"

  let { data }: PageProps = $props()
  const post: Post = data.post

  globalThis.matchMedia && globalThis.matchMedia("(prefers-color-scheme: dark)").matches
    ? import("highlight.js/styles/github-dark.css")
    : import("highlight.js/styles/github.css")
</script>

<svelte:head>
  <meta name="author" content="David Vivar Bogónez" />
  <link rel="icon" href={PFP} />

  <title>{post.title}</title>
  <meta name="description" content={post.description} />

  <meta property="og:title" content={post.title} />
  <meta property="og:type" content="article" />
  <meta property="og:description" content={post.description} />
  <meta property="og:url" content={`${POSTS_URL}${post.slug}`} />
  <meta property="og:site_name" content={post.title} />
  <meta property="og:locale" content="en_US">
  <meta property="og:image" content={BANNER_URL} />

  <meta name="twitter:title" content={post.title} />
  <meta name="twitter:description" content={post.description} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@4ster_light" />
  <meta name="twitter:image" content={BANNER_URL} />
  <meta property="twitter:image:height" content="600" />
  <meta property="twitter:image:width" content="1200" />
</svelte:head>

<article class="post">
  <header class="header">
    <h1>{post.title}</h1>
    <PostMeta date={post.date} tags={post.tags} />
  </header>

  <div class="content">
    {@html post.content}
  </div>
</article>

<nav class="footer-nav">
  <a href="/" class="back-link">← back</a>
  <SupportButton />
</nav>

<style lang="scss">
  @use "$lib/styles/fonts";

  .post {
    margin-bottom: 2rem;

    .header {
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
    }

    .content {
      :global(img) {
        max-width: 100%;
        display: block;
        margin: 0 auto;
        height: auto;
      }

      :global(img + img) {
        margin-top: 1rem;
      }
    }
  }

  .footer-nav {
    padding-top: 1.5rem;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;

    .back-link {
      color: var(--text-dim);
      font-size: 1rem;
      position: relative;
      transition: color 0.2s ease;
      font-family: fonts.$font-mono;

      &:hover {
        color: var(--accent-bright);
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
  }
</style>
