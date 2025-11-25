import { GH_API } from "$env/static/private"
import fetchPosts from "$lib/posts"
import type { EntryGenerator, PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"

const posts = await fetchPosts(GH_API)

export const entries: EntryGenerator = () => {
  return posts.map((post) => ({
    slug: post.slug
  }))
}

export const load: PageServerLoad = (event) => {
  const slug = event.params.slug
  const post = posts.find((post) => post.slug === slug)

  if (!post) throw error(404, "Post not found")

  event.setHeaders({
    "Cache-Control": "public, max-age=3600" // Cache for 1 hour
  })

  return {
    post
  }
}
