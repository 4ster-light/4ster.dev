import { page } from "fresh"
import { Head } from "fresh/runtime"
import { define } from "@/utils.ts"
import urls from "@/lib/urls.ts"
import { fetchPosts, type Post } from "@/lib/content/posts.ts"
import { extractHeadings, type TocItem } from "@/lib/toc.ts"
import PostMeta from "@/components/PostMeta.tsx"
import TocSidebar from "@/components/TocSidebar.tsx"
import ButtonLink from "@/components/ButtonLink.tsx"

function SEO({ post }: { post: Post }) {
  return (
    <Head>
      <title>{post.title}</title>
      <meta name="author" content="David Vivar Bogónez" />
      <meta name="description" content={post.description} />

      <meta property="og:title" content={post.title} />
      <meta property="og:type" content="article" />
      <meta property="og:description" content={post.description} />
      <meta property="og:url" content={`${urls.url}/posts/${post.slug}`} />
      <meta property="og:site_name" content={post.title} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image" content={urls.banner} />

      <meta name="twitter:title" content={post.title} />
      <meta name="twitter:description" content={post.description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@4ster_light" />
      <meta name="twitter:image" content={urls.banner} />
      <meta property="twitter:image:height" content="600" />
      <meta property="twitter:image:width" content="1200" />
    </Head>
  )
}

interface PageData {
  post?: Post
  toc?: TocItem[]
}

export const handler = define.handlers({
  async GET(ctx) {
    const githubToken = Deno.env.get("GH_API") || ""

    const posts = await fetchPosts(githubToken)
    const post = posts.find((p: Post) => p.slug === ctx.params.slug)

    if (!post)
      return page<PageData>({ post: undefined }, { status: 404 })

    const { html, items } = extractHeadings(post.content)
    post.content = html

    return page<PageData>({ post, toc: items })
  }
})

export default define.page<typeof handler>(async (ctx) => {
  const { post, toc } = ctx.data

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

      <div class="grid grid-cols-1 lg:grid-cols-6 gap-8">
        <main
          class="-mt-6 prose lg:col-span-4"
          // deno-lint-ignore react-no-danger
          dangerouslySetInnerHTML={{ __html: post.content }}
        >
        </main>

        <div class="lg:col-span-2 lg:border-l lg:border-base-300 lg:pl-8 hidden lg:block">
          <TocSidebar items={toc || []} />
        </div>
      </div>

      <div class="divider" />

      <footer class="flex justify-end gap-4 sm:flex-row">
        <ButtonLink href={urls.url} target="">
          <img
            src={(await (import("@/assets/icons/LeftArrows.svg"))).default}
            alt="Left Arrows"
            class="size-8"
          />
        </ButtonLink>
        <ButtonLink href={urls.githubSponsors}>
          <img
            src={(await (import("@/assets/icons/Love.svg"))).default}
            alt="Sponsor"
            class="size-6"
          />{" "}
          Sponsor
        </ButtonLink>
      </footer>
    </>
  )
})
