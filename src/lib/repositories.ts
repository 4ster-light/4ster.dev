import { config } from "dotenv"
import { join } from "node:path"
import process from "node:process"

config({ path: join(process.cwd(), ".env") })

type Repository = {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  updated_at: string
}

export type RepositoryInfo = {
  name: string
  url: string
  description: string | null
  stars: number
  forks: number
  language: string | null
  updatedAt: string
}

// Cache to avoid multiple API calls
let repositoriesCache: RepositoryInfo[] | null = null

async function fetchRepositories(): Promise<Repository[]> {
  const token = process.env.GH_API
  if (!token) throw new Error("GH_API environment variable is not set.")

  const headers = new Headers({
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
  })

  return await fetch("https://api.github.com/user/repos", {
    method: "GET",
    headers,
  })
    .catch((error) => {
      throw new Error(`GitHub API request failed: ${error}`)
    })
    .then((response) => response.json())
    .then((repositories: Repository[]) =>
      repositories
        .filter((repo) => repo.name !== "4ster-light" && repo.stargazers_count !== 0)
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
    )
}

async function extractRelevantInfo(): Promise<RepositoryInfo[]> {
  if (repositoriesCache) return repositoriesCache

  const repos = await fetchRepositories().then((repos) =>
    repos.map((repo) => ({
      name: repo.name,
      url: repo.html_url,
      description: repo.description,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      updatedAt: new Date(repo.updated_at).toLocaleDateString(),
    }))
  )

  repositoriesCache = repos
  return repos
}

export default await extractRelevantInfo()
