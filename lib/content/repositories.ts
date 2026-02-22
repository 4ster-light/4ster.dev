import marked from "@/lib/marked.ts"
import { cachedArray } from "@/lib/cache.ts"

export interface Repository {
  name: string
  url: string
  description?: string
  stars: number
  forks: number
  language?: string
  updated_at: string
  readme?: string
}

interface RawRepository {
  id: number
  full_name: string
  name: string
  html_url: string
  description?: string
  stargazers_count: number
  forks: number
  language?: string
  updated_at: string
}

const REPOS_CACHE_TTL = 2 * 60 * 60 * 1000 // 2 hours

async function fetchReadme(
  owner: string,
  repo: string,
  token: string
): Promise<string> {
  return await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
    method: "GET",
    redirect: "follow",
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "4ster-dev-blog"
    })
  })
    .then((response) => response.ok ? response.json() : Promise.reject(response.statusText))
    .then(({ content }: { content: string }) => {
      const decodedContent = atob(content.replace(/\s/g, ""))
      const bytes = Uint8Array.from(decodedContent, (c) => c.charCodeAt(0))
      const utf8Content = new TextDecoder("utf-8").decode(bytes)
      const adjustedContent = utf8Content.replace(
        /\]\((?!https?:\/\/)([^)]+)\)/g,
        `](https://github.com/${owner}/${repo}/blob/main/$1)`
      )
      return marked.parse(adjustedContent)
    })
    .catch((error) => {
      console.error(`Failed to fetch README for ${owner}/${repo}: ${error}`)
      return ""
    })
}

async function fetchRepositoriesFromGitHub(githubToken: string): Promise<Repository[]> {
  return await fetch("https://api.github.com/user/repos", {
    method: "GET",
    redirect: "follow",
    headers: new Headers({
      Authorization: `Bearer ${githubToken}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "4ster-dev-blog"
    })
  })
    .then((response) => response.ok ? response.json() : Promise.reject(response.statusText))
    .then((data: RawRepository[]) =>
      Promise.all(
        data
          .filter((repo) => repo.name !== "4ster-light" && repo.stargazers_count > 0)
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .map(async (repo) => {
            const parts = repo.full_name.split("/")
            const owner = parts[0] ?? ""
            const repoName = parts[1] ?? ""
            return await fetchReadme(owner, repoName, githubToken).then((readme) => ({
              name: repo.name,
              url: repo.html_url,
              description: repo.description,
              stars: repo.stargazers_count,
              forks: repo.forks,
              language: repo.language,
              updated_at: new Date(repo.updated_at).toLocaleDateString(),
              readme
            }))
          })
      )
    )
    .catch((error) => {
      throw new Error(`GitHub API repositories request failed: ${error}`)
    })
}

export function fetchRepositories(githubToken: string): Promise<Repository[]> {
  return cachedArray(
    "repositories",
    REPOS_CACHE_TTL,
    (repo) => repo.name,
    () => fetchRepositoriesFromGitHub(githubToken)
  )
}
