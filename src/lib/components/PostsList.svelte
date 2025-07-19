<script lang="ts">
  import { formatDate } from "$lib/posts";
  import type { Post } from "$lib/types/post";
  
  type Props = {
    posts: Post[];
  };

  let props: Props = $props();
</script>

<section class="posts">
  <h2>Blog Posts</h2>
  {#each props.posts as post}
    <article class="post">
      <div class="post-header">
        <h3><a href="/posts/{post.slug}">{post.title}</a></h3>
        <time datetime={post.date}>{formatDate(new Date(post.date))}</time>
      </div>
      <p class="description">{post.description}</p>
      {#if post.tags?.length}
        <div class="tags">
          {#each post.tags as tag}
            <span class="tag">{tag}</span>
          {/each}
        </div>
      {:else}
        <div class="tags">
          <span class="tag">UNCATEGORISED</span>
        </div>
      {/if}
    </article>
  {/each}
</section>

<style lang="scss">
  @use "$lib/styles/fonts";

  .posts {
    h2 {
      font-size: 1.6rem;
      margin-bottom: 1.5rem;
      color: var(--accent-bright);
    }

    .post {
      padding-bottom: 1.5rem;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--border);

      &:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }

      .post-header {
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

        time {
          color: var(--text-dim);
          font-family: fonts.$font-mono;
          font-size: 0.8rem;
          white-space: nowrap;
        }
      }

      .description {
        margin: 0.5rem 0;
        font-size: 0.9rem;
      }

      .tags {
        font-family: fonts.$font-mono;
        display: flex;
        gap: 0.4rem;
        flex-wrap: wrap;
        margin-top: 0.8rem;

        .tag {
          background: var(--bg-secondary);
          color: var(--text-dim);
          padding: 0.15rem 0.4rem;
          border-radius: 3px;
          font-size: 0.75rem;
          border: 1px solid var(--border);
        }
      }
    }
  }
</style>
