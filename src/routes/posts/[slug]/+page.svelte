<script lang="ts">
  import PostMeta from "$lib/components/PostMeta.svelte"
  import SupportButton from "$lib/components/SupportButton.svelte"
  import { page } from "$app/state"
  import { error } from "@sveltejs/kit"
  import type { Post } from "$lib/types/post"
  import LoadingSpinner from "$lib/components/LoadingSpinner.svelte"
  import { BANNER_URL, PFP_URL, POSTS_URL } from "$lib/urls"

  $effect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)
      import("highlight.js/styles/github-dark.css")
    else import("highlight.js/styles/github.css")
  })

  const getPost = async (): Promise<Post> =>
    await fetch(POSTS_URL)
      .then((res) => res.json())
      .then((posts: Post[]) => posts.find((post) => post.slug === page.params.slug as string))
      .catch(() => {
        throw error(404, `Post ${page.params.slug} not found`)
      }) as Post
</script>

<svelte:head>
  <meta name="author" content="David Vivar Bogónez" />
  <link rel="icon" href={PFP_URL} />

  {#await getPost() then post}
    <title>{post.title}</title>
    <meta name="description" content={post.description} />

    <meta property="og:title" content={post.title} />
    <meta property="og:type" content="article" />
    <meta property="og:description" content={post.description} />
    <meta property="og:url" content={`${POSTS_URL}/${post.slug}`} />
    <meta property="og:site_name" content={post.title} />
    <meta property="og:locale" content="en_US">

    <meta name="twitter:title" content={post.title} />
    <meta name="twitter:description" content={post.description} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@4ster_light" />
    <meta name="twitter:image" content={BANNER_URL} />
    <meta property="twitter:image:height" content="600" />
    <meta property="twitter:image:width" content="1200" />
  {/await}
</svelte:head>

<article class="post">
  {#await getPost()}
    <LoadingSpinner />
  {:then post}
    <header class="header">
      <h1>{post.title}</h1>
      <PostMeta date={post.date} tags={post.tags} />
    </header>

    <div class="content">
      {@html post.content}
    </div>
  {:catch error}
    <h1 class="error-message">Error loading post: {error.message}</h1>
  {/await}
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
