import repositories from "$lib/repositories"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = () => ({
  repositories,
})
