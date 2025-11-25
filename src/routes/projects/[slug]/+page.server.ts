import { GH_API } from "$env/static/private"
import fetchRepositories from "$lib/repositories"
import type { EntryGenerator, PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"

const repositories = await fetchRepositories(GH_API)

export const entries: EntryGenerator = () => {
  return repositories.map((repository) => ({
    slug: repository.name
  }))
}

export const load: PageServerLoad = (event) => {
  const slug = event.params.slug
  const repository = repositories.find((repository) => repository.name === slug)

  if (!repository) throw error(404, "Repository not found")

  event.setHeaders({
    "Cache-Control": "public, max-age=3600" // Cache for 1 hour
  })

  return {
    repository
  }
}
