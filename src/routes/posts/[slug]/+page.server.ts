import type { EntryGenerator, PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"
import posts from "$lib/assets/posts.json" with { type: "json" }

export const prerender = true
export const csr = false

export const entries: EntryGenerator = () =>
  posts.map((post) => ({
    slug: post.slug,
  }))

export const load: PageServerLoad = (event) => {
  const slug = event.params.slug
  const post = posts.find((post) => post.slug === slug)

  if (!post)
    throw error(404, "Post not found")

  return {
    post,
  }
}
