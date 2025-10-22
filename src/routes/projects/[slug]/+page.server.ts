import repositories from "$lib/repositories"
import type { EntryGenerator, PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"

export const prerender = true
export const csr = false

export const entries: EntryGenerator = () =>
  repositories.map((repo) => ({
    slug: repo.name,
  }))

export const load: PageServerLoad = (event) => {
  const slug = event.params.slug
  const repo = repositories.find((repo) => repo.name === slug)

  if (!repo) throw error(404, "Repository not found")

  return {
    repo,
  }
}
