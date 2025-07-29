<script lang="ts">
  import PostsList from "$lib/components/PostsList.svelte"
  import { error } from "@sveltejs/kit"
  import type { Post } from "$lib/types/post"

  const getPosts = async () =>
    await fetch("/posts.json").then((res) => res.json()).catch(() => {
      throw error(404, "No posts found")
    }) as Post[]
</script>

<svelte:head>
  <title>✰λster✰</title>
  <meta
    name="description"
    content="David Vivar Bogónez - A minimal blog about programming, technology, and life."
  />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="✰λster✰" />
  <meta
    property="og:description"
    content="Personal blog about programming and software in general by David Vivar Bogónez"
  />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary" />
  <meta property="twitter:title" content="✰λster✰" />
  <meta
    property="twitter:description"
    content="Personal blog about programming and software in general by David Vivar Bogónez"
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

<section class="posts">
  <h2>Blog Posts</h2>
  {#await getPosts()}
    <h1>Loading posts...</h1>
  {:then posts}
    <PostsList {posts} />
  {:catch error}
    <h1>Error loading posts: {error.message}</h1>
  {/await}
</section>

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

  .posts {
    h2 {
      font-size: 1.6rem;
      margin-bottom: 1.5rem;
      color: var(--accent-bright);
    }
  }
</style>
