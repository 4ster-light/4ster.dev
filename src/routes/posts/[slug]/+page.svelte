<script lang="ts">
  import PostMeta from "$lib/components/PostMeta.svelte"
  import { BANNER_URL, KOFI_URL, POSTS_URL } from "$lib/urls"
  import PFP from "$lib/assets/pfp.jpg"
  import LeftArrows from "$lib/assets/icons/LeftArrows.svg"
  import Button from "$lib/components/Button.svelte"
  import CreditCard from "$lib/assets/icons/CreditCard.svg"
  import { afterNavigate } from "$app/navigation"
  import type { PageProps } from "./$types"
  import type { Post } from "$lib/posts"
  import "highlight.js/styles/github-dark.css"

  let { data }: PageProps = $props()
  const post: Post = data.post
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
  <header>
    <h1>{post.title}</h1>
    <PostMeta date={post.date} tags={post.tags} />
  </header>

  <div class="content">
    {@html post.content}
  </div>
</article>

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

<style lang="scss">
  @use "$lib/styles/fonts";

  .post {
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

  footer {
    nav {
      padding-top: 1.5rem;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>
