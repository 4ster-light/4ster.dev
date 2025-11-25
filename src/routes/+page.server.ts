import { GH_API } from "$env/static/private"
import fetchPosts from "$lib/posts"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async (event) => {
  const posts = await fetchPosts(GH_API)

  event.setHeaders({
    "Cache-Control": "public, max-age=3600" // Cache for 1 hour
  })

  return {
    posts
  }
}
