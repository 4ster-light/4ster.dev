<script lang="ts">
  import { formatDate } from "$lib/posts"

  type Props = {
    date: string
    tags?: string[]
  }

  let props: Props = $props()
</script>

<div class="meta">
  <time datetime={props.date}>{formatDate(new Date(props.date))}</time>
  {#if props.tags?.length}
    <div class="tags">
      {#each props.tags as tag}
        <span class="tag">{tag}</span>
      {/each}
    </div>
  {:else}
    <div class="tags">
      <span class="tag">UNCATEGORISED</span>
    </div>
  {/if}
</div>

<style lang="scss">
  @use "$lib/styles/fonts";

  .meta {
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

    time {
      color: var(--text-dim);
      font-size: 0.8rem;
    }

    .tags {
      display: flex;
      gap: 0.4rem;
      flex-wrap: wrap;

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
</style>
