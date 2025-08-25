import type { EntryGenerator, PageServerLoad } from "./$types"
import type { Post } from "$lib/types/post"
import { error } from "@sveltejs/kit"
import posts from "$lib/posts.json"

export const prerender = true
export const csr = false

export const entries: EntryGenerator = () =>
  posts.map((post: Post) => ({
    slug: post.slug,
  }))

export const load: PageServerLoad = (event) => {
  const slug = event.params.slug
  const post = posts.find((post: Post) => post.slug === slug)

  if (!post)
    throw error(404, "Post not found")

  return {
    post,
  }
}
