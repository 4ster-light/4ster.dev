import repositories from "$lib/repositories"
import type { EntryGenerator, PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"

export const prerender = true
export const csr = false

export const entries: EntryGenerator = () =>
  repositories.map((repository) => ({
    slug: repository.name
  }))

export const load: PageServerLoad = (event) => {
  const slug = event.params.slug
  const repository = repositories.find((repository) => repository.name === slug)

  if (!repository) throw error(404, "Repository not found")

  return {
    repository
  }
}
