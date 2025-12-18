import { page } from "fresh"
import { Head } from "fresh/runtime"
import { define } from "@/utils.ts"
import urls from "@/lib/urls.ts"
import { fetchPosts, type Post } from "@/lib/posts.ts"
import PostMeta from "@/components/PostMeta.tsx"
import ButtonLink from "@/components/ButtonLink.tsx"

function SEO({ post }: { post: Post }) {
  return (
    <Head>
      <title>{post.title}</title>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github-dark.min.css"
      />
      <meta name="author" content="David Vivar Bogónez" />
      <meta name="description" content={post.description} />

      <meta property="og:title" content={post.title} />
      <meta property="og:type" content="article" />
      <meta property="og:description" content={post.description} />
      <meta property="og:url" content={`${urls.url}/posts/${post.slug}`} />
      <meta property="og:site_name" content={post.title} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image" content={urls.bannerUrl} />

      <meta name="twitter:title" content={post.title} />
      <meta name="twitter:description" content={post.description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@4ster_light" />
      <meta name="twitter:image" content={urls.bannerUrl} />
      <meta property="twitter:image:height" content="600" />
      <meta property="twitter:image:width" content="1200" />
    </Head>
  )
}

interface PageData {
  post?: Post
}

export const handler = define.handlers({
  async GET(ctx) {
    const githubToken = Deno.env.get("GH_API") || ""

    const posts = await fetchPosts(githubToken)
    const post = posts.find((p: Post) => p.slug === ctx.params.slug)

    return post ? page<PageData>({ post }) : page<PageData>({ post: undefined }, { status: 404 })
  }
})

export default define.page<typeof handler>(async (ctx) => {
  const { post } = ctx.data

  if (!post) {
    return (
      <div class="text-center py-16">
        <h1 class="text-3xl text-error font-bold mb-4">Post Not Found</h1>
        <p class="text-base-content/70 mb-6">
          The post you're looking for doesn't exist.
        </p>
        <ButtonLink href={urls.url} target="">
          <img
            src={(await import("@/assets/icons/LeftArrows.svg")).default}
            alt="Left Arrows"
            class="size-8"
          />
        </ButtonLink>
      </div>
    )
  }

  return (
    <>
      <SEO post={post} />

      <PostMeta post={post} header />

      <div class="divider mb-12" />

      <main
        class="prose"
        // deno-lint-ignore react-no-danger
        dangerouslySetInnerHTML={{ __html: post.content }}
      >
      </main>

      <div class="divider" />

      <footer class="flex justify-end gap-4 sm:flex-row">
        <ButtonLink href={urls.url} target="">
          <img
            src={(await (import("@/assets/icons/LeftArrows.svg"))).default}
            alt="Left Arrows"
            class="size-8"
          />
        </ButtonLink>
        <ButtonLink href={urls.kofiUrl}>
          <img
            src={(await (import("@/assets/icons/CreditCard.svg"))).default}
            alt=" Buy me a Coffee"
            class="size-6"
          />{" "}
          Buy me a Coffee
        </ButtonLink>
      </footer>
    </>
  )
})
