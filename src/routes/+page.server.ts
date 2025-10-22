import posts from "$lib/posts"
import type { PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"

export const load: PageServerLoad = () => {
  if (!posts) throw error(404, "Posts not found")

  return {
    posts,
  }
}
