import repossitories from "$lib/repositories"
import type { EntryGenerator, PageServerLoad } from "./$types"
import { error } from "@sveltejs/kit"

export const prerender = true
export const csr = false

const repos = await repossitories()

export const entries: EntryGenerator = async () =>
  repos.map((repo) => ({
    slug: repo.name,
  }))

export const load: PageServerLoad = async (event) => {
  const slug = event.params.slug
  const repo = repos.find((repo) => repo.name === slug)

  if (!repo)
    throw error(404, "Repository not found")

  return {
    repo,
  }
}
