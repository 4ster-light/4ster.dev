import { Head } from "fresh/runtime"
import { page } from "fresh"
import { define } from "@/utils.ts"
import { fetchPosts, type Post } from "@/lib/posts.ts"
import urls from "@/lib/urls.ts"
import PostMeta from "@/components/PostMeta.tsx"

function SEO() {
  return (
    <Head>
      <title>✰λster✰</title>
      <meta
        name="description"
        content="Personal blog about programming, technology, and life."
      />
      <meta name="author" content="David Vivar Bogónez" />

      <meta property="og:title" content="✰λster✰" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={urls.bannerUrl} />
      <meta
        property="og:description"
        content="Personal blog about programming, technology, and life."
      />
      <meta property="og:url" content={urls.url} />
      <meta property="og:site_name" content="✰λster✰" />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:title" content="✰λster✰" />
      <meta
        name="twitter:description"
        content="Personal blog about programming, technology, and life."
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@4ster_light" />
      <meta name="twitter:image" content={urls.bannerUrl} />
      <meta property="twitter:image:height" content="600" />
      <meta property="twitter:image:width" content="1200" />
    </Head>
  )
}

interface PageData {
  posts?: Post[]
}

export const handler = define.handlers({
  async GET(_ctx) {
    const githubToken = Deno.env.get("GH_API") || ""
    const posts = await fetchPosts(githubToken)
    return page<PageData>({ posts })
  }
})

export default define.page<typeof handler>(function Home(ctx) {
  const { posts } = ctx.data

  return (
    <>
      <SEO />

      {/* Introduction Section */}
      <section class="flex gap-4 items-center md:flex-row flex-col md:text-left text-center">
        <img
          src="/pfp.jpg"
          alt="Avatar"
          class="w-24 h-24 object-cover shrink-0 rounded-lg"
        />
        <p class="m-0 text-base-content/80">
          Hi, I am{" "}
          <strong class="text-primary">David Vivar Bogónez</strong>, a Spanish programmer most known
          as{" "}
          <strong class="text-primary">Aster</strong>, I am a computer engineering undergraduate at
          {" "}
          <a href={urls.uniUrl} target="_blank" rel="noopener">
            ESI-UCLM
          </a>
          . I am very passionate about software, specially networks and systems, as well as full
          stack web development with languages/technologies like Python, Typescript, Rust, Svelte,
          and F# among others.
        </p>
      </section>

      <div class="divider"></div>

      {/* Posts List */}
      <section>
        <h2 class="text-2xl font-bold text-secondary mb-6">Blog Posts</h2>
        {posts && posts.length > 0
          ? (
            <div class="space-y-8">
              {posts
                .filter((post) => !post["is-preview"])
                .map((post) => <PostMeta key={post.slug} post={post} />)}
            </div>
          )
          : (
            <p class="text-error text-4xl leading-relaxed">
              Problem loading posts.
            </p>
          )}
      </section>

      <div class="my-8"></div>

      {/* Projects Section */}
      <section>
        <h2 class="text-2xl font-bold mb-4 text-secondary">Projects</h2>
        <p class="text-base-content/80 leading-relaxed">
          I also have some open source projects of my own, you can check them out on my{" "}
          <a href={urls.projectsUrl}>projects page</a>. The most significant is my website{" "}
          <a
            href="https://artscii.deno.dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            artscii.deno.dev
          </a>
          , an image to ascii art converter used by dozens of people on X/Twitter. Of which I have
          compiled some of the best images created with it in an{" "}
          <a
            href="https://ko-fi.com/album/Ascii-Art-L4L21KA9TI"
            target="_blank"
            rel="noopener noreferrer"
          >
            image album
          </a>{" "}
          in my <strong>Ko-Fi page</strong>.
        </p>
      </section>
    </>
  )
})
