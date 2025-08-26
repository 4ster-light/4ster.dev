import type { PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"
import posts from "$lib/assets/posts.json" with { type: "json" }

export const prerender = true

export const load: PageServerLoad = () => {
  if (!posts)
    throw error(404, "Posts not found")

  return {
    posts,
  }
}
