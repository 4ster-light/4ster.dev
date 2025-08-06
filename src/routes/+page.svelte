<script lang="ts">
  import PostsList from "$lib/components/PostsList.svelte"
  import { error } from "@sveltejs/kit"
  import type { Post } from "$lib/types/post"
  import LoadingSpinner from "$lib/components/LoadingSpinner.svelte"

  const getPosts = async () =>
    await fetch("/posts.json").then((res) => res.json()).catch(() => {
      throw error(404, "No posts found")
    }) as Post[]

  const description = "Personal blog about programming, technology, and life." as const
</script>

<svelte:head>
  <title>✰λster✰</title>
  <meta
    name="description"
    content={description}
  />
  <meta name="author" content="David Vivar Bogónez" />
  <link rel="icon" href="/pfp.jpg" />

  <meta property="og:title" content="✰λster✰" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="/banner.png" />
  <meta property="og:description" content={description} />
  <meta property="og:url" content="https://aster.deno.dev/" />
  <meta property="og:site_name" content="✰λster✰" />
  <meta property="og:locale" content="en_US">

  <meta name="twitter:title" content="✰λster✰" />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@4ster_light" />
  <meta name="twitter:image" content="/banner.png" />
  <meta property="twitter:image:height" content="600" />
  <meta property="twitter:image:width" content="1200" />
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
    <LoadingSpinner />
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
