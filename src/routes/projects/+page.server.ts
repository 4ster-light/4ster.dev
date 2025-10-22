import repositories from "$lib/repositories"
import type { PageServerLoad } from "./$types"

export const prerender = true
export const csr = false

export const load: PageServerLoad = () => ({
  repositories,
})
