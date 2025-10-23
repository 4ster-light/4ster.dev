import { config } from "dotenv"
import { join } from "node:path"
import process from "node:process"

config({ path: join(process.cwd(), ".env") })

export type Repository = {
  name: string
  url: string
  description: string | null
  stars: number
  forks: number
  language: string | null
  updated_at: string
}

type RawRepository = Repository & {
  id: number
  full_name: string
}

const githubToken = process.env.GH_API
if (!githubToken) throw new Error("GH_API environment variable is not set.")

const repositories: Repository[] = await fetch("https://api.github.com/user/repos", {
  method: "GET",
  headers: new Headers({
    Authorization: `Bearer ${githubToken}`,
    Accept: "application/vnd.github.v3+json"
  })
})
  .then((response) => response.json())
  .then((repositories: RawRepository[]) =>
    repositories
      .filter((repo) => repo.name !== "4ster-light" && repo.stars !== 0)
      .sort((a, b) => b.stars - a.stars)
      .map((repo) => ({
        name: repo.name,
        url: repo.url,
        description: repo.description,
        stars: repo.stars,
        forks: repo.forks,
        language: repo.language,
        updated_at: new Date(repo.updated_at).toLocaleDateString()
      }))
  ).catch((error) => {
    throw new Error(`GitHub API request failed: ${error}`)
  })

export default repositories
