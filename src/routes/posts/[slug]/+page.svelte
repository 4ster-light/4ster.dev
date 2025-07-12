<script lang="ts">
  import PostMeta from "$lib/components/PostMeta.svelte";
  import type { Post } from "$lib/posts";

  type Props = {
    data: {
      post: Post;
    };
  };

  let props: Props = $props();
  let post = props.data.post;
</script>

<svelte:head>
  <title>{post.title} - ✰λster✰</title>
  <meta name="description" content={post.description} />
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
