import "@std/dotenv/load"

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
  const token = Deno.env.get("GH_API")
  if (!token)
    throw new Error("GITHUB_API environment variable is not set.")

  const headers = new Headers({
    "Authorization": `Bearer ${token}`,
    "Accept": "application/vnd.github.v3+json",
  })

  return await fetch("https://api.github.com/user/repos", {
    method: "GET",
    headers,
  }).catch((error) => {
    throw new Error(`GitHub API request failed: ${error}`)
  }).then((response) => response.json())
    .then((repositories: Repository[]) =>
      repositories
        .filter((repo) => (repo.name !== "4ster-light") && (repo.stargazers_count !== 0))
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
    )
}

export default async function extractRelevantInfo(): Promise<RepositoryInfo[]> {
  if (repositoriesCache)
    return repositoriesCache

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
