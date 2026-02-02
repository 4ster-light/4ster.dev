import { Head } from "fresh/runtime"
import { page } from "fresh"
import { define } from "@/utils.ts"
import { fetchPosts, type Post } from "@/lib/content/posts.ts"
import urls, { ogImage } from "@/lib/urls.ts"
import PostMeta from "@/components/PostMeta.tsx"

function SEO() {
  const image = ogImage("Aster", {
    subtitle: "Personal blog about programming, technology, and computer science."
  })

  return (
    <Head>
      <title>✰λster✰</title>
      <meta
        name="description"
        content="Personal blog about programming, technology, and computer science."
      />
      <meta name="author" content="David Vivar Bogónez" />

      <meta property="og:title" content="✰λster✰" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={image} />
      <meta
        property="og:description"
        content="Personal blog about programming, technology, and computer science."
      />
      <meta property="og:url" content={urls.baseUrl} />
      <meta property="og:site_name" content="✰λster✰" />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:title" content="✰λster✰" />
      <meta
        name="twitter:description"
        content="Personal blog about programming, technology, and computer science."
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@4ster_light" />
      <meta name="twitter:image" content={image} />
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

    return posts ? page<PageData>({ posts }) : page<PageData>({ posts: undefined }, { status: 404 })
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
          <strong class="text-primary">David Vivar Bogónez</strong>, a Spanish open source developer
          most known as{" "}
          <strong class="text-primary">Aster</strong>, I am a computer engineering undergraduate at
          {" "}
          <a href={urls.uni} target="_blank" rel="noopener">
            ESI-UCLM
          </a>
          . I am very passionate about software and computers in general, I use technologies like
          Python, TypeScript, Rust, Kotlin and Preact, among others.
        </p>
      </section>

      <div class="divider"></div>

      {/* Projects Section */}
      <section>
        <h2 class="text-2xl font-bold mb-4 text-secondary">Projects</h2>
        <p class="text-base-content/80 leading-relaxed">
          I also have some open source projects of my own, you can check them out on my{" "}
          <a href={urls.projects}>projects page</a>. The most significant ones are pinned on my{" "}
          <a href={urls.githubSponsors} target="_blank" rel="noopener">
            GitHub Sponsors Profile
          </a>.
        </p>
      </section>

      <div class="divider"></div>

      {/* Posts List */}
      <section>
        <h2 class="text-2xl font-bold text-secondary mb-6">Blog Posts</h2>
        <p class="text-base-content/80 mb-8">
          Hey! Welcome to my blog. Here you'll find articles about all sorts of topics related to
          computer science and programming. Know that you can find more (some not published here)
          posts on my <a href={urls.substack} target="_blank" rel="noopener">Substack</a>{" "}
          publication.
        </p>
        {posts && posts.length > 0
          ? (
            <div class="space-y-10">
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
    </>
  )
})
