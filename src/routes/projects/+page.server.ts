import { GH_API } from "$env/static/private"
import fetchRepositories from "$lib/repositories"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async (event) => {
  const repositories = await fetchRepositories(GH_API)

  event.setHeaders({
    "Cache-Control": "public, max-age=3600" // Cache for 1 hour
  })

  return {
    repositories
  }
}
