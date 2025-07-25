<script lang="ts">
  import PostsList from "$lib/components/PostsList.svelte"
  import type { Post } from "$lib/types/post"

  type Props = {
    data: {
      posts: Post[]
    }
  }

  let props: Props = $props()
</script>

<svelte:head>
  <title>✰λster✰</title>
  <meta
    name="description"
    content="David Vivar Bogónez - A minimal blog about programming, technology, and life."
  />
</svelte:head>

<section class="intro">
  <img src="/pfp.jpg" alt="Avatar" class="avatar" />
  <p>
    Hi, I am <strong>David Vivar Bogónez</strong>, a Spanish programmer most known as <strong
    >Aster</strong>, I am a computer engineering undergraduate at
    <a href="https://uclm.es/" target="_blank" rel="noopener">UCLM</a>. I am very passionate about
    software, especially fullstack web development and game development, as well as other areas with
    languages/technologies like Typescript, Svelte, C#/F# and Rust.
  </p>
</section>
<hr />
<PostsList posts={props.data.posts} />

<style lang="scss">
  .intro {
    display: flex;
    gap: 1rem;
    align-items: center;

    .avatar {
      width: 100px;
      height: 100px;
      object-fit: cover;
      flex-shrink: 0;
    }

    p {
      flex-grow: 1;
      margin-bottom: 0;
      text-align: justify;

      strong {
        color: var(--accent);
      }
    }

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: center;
      text-align: center;

      .avatar {
        align-self: center;
      }

      p {
        margin-top: 0;
        margin-bottom: 0;
      }
    }
  }
</style>
