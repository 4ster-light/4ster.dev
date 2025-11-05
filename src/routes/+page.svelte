<script lang="ts">
  import PostsList from "$lib/components/PostsList.svelte"
  import { BANNER_URL, PROJECTS_URL, UNI_URL, URL } from "$lib/urls"
  import PFP from "$lib/assets/pfp.jpg"
  import type { PageProps } from "./$types"
  import type { Post } from "$lib/posts"

  let { data }: PageProps = $props()
  const posts: Post[] = data.posts
</script>

<svelte:head>
  <title>✰λster✰</title>
  <meta
    name="description"
    content="Personal blog about programming, technology, and life."
  />
  <meta name="author" content="David Vivar Bogónez" />
  <link rel="icon" href={PFP} />

  <meta property="og:title" content="✰λster✰" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content={BANNER_URL} />
  <meta
    property="og:description"
    content="Personal blog about programming, technology, and life."
  />
  <meta property="og:url" content={URL} />
  <meta property="og:site_name" content="✰λster✰" />
  <meta property="og:locale" content="en_US">

  <meta name="twitter:title" content="✰λster✰" />
  <meta
    name="twitter:description"
    content="Personal blog about programming, technology, and life."
  />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@4ster_light" />
  <meta name="twitter:image" content={BANNER_URL} />
  <meta property="twitter:image:height" content="600" />
  <meta property="twitter:image:width" content="1200" />
</svelte:head>

<section class="intro">
  <img src={PFP} alt="Avatar" class="avatar" />
  <p>
    Hi, I am <strong>David Vivar Bogónez</strong>, a Spanish programmer most known as <strong
    >Aster</strong>, I am a computer engineering undergraduate at
    <a href={UNI_URL} target="_blank" rel="noopener">ESI-UCLM</a>. I am very passionate about
    software, specially networks and systems, as well as full stack web development with
    languages/technologies like Python, Typescript, Rust, Svelte, and F# among others.
  </p>
</section>
<hr />

<section class="posts">
  <h2>Blog Posts</h2>
  <PostsList {posts} />

  <h2>Projects</h2>
  <p>
    I also have some open source projects of my own, you can check them out on my
    <a href={PROJECTS_URL}>projects page</a>. The most significant is my website <a
      href="https://artscii.deno.dev"
      target="_blank"
      rel="noopener"
    >artscii.deno.dev</a>, an image to ascii art converter used by dozens of people on X/Twitter. Of
    which I have compiled some of the best images created with it in an <a
      href="https://ko-fi.com/album/Ascii-Art-L4L21KA9TI"
      target="_blank"
      rel="noopener"
    >image album</a> in my <strong>Ko-Fi page</strong>.
  </p>
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

      @media (min-width: 768px) {
        text-align: justify;
      }

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
