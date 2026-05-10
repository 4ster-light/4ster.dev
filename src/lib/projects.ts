import marked from "./marked.ts"

export const FEATURED_REPOS = [
  "artscii",
  "sentinel",
  "perlin",
  "http",
  "pmatrix",
  "bfcompiler",
  "py-logic",
  "rshell"
] as const

export interface Repository {
  name: string
  full_name: string
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

const projectsCache = new Map<string, Promise<Repository[]>>()
const readmeCache = new Map<string, Promise<string>>()

function fetchReadme(owner: string, repo: string, token: string): Promise<string> {
  const cacheKey = `${token || "__no_token__"}:${owner}/${repo}`
  const cached = readmeCache.get(cacheKey)
  if (cached) return cached

  const promise = (async () => {
    const headers = new Headers({
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "4ster-dev-site"
    })

    if (token) headers.set("Authorization", `Bearer ${token}`)

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      method: "GET",
      headers
    })

    if (!response.ok) return ""

    const { content } = (await response.json()) as { content?: string }
    if (!content) return ""

    const decodedContent = atob(content.replace(/\s/g, ""))
    const bytes = Uint8Array.from(decodedContent, (char) => char.charCodeAt(0))
    const utf8Content = new TextDecoder("utf-8").decode(bytes)
    const adjustedContent = utf8Content.replace(
      /\]\((?!https?:\/\/)([^)]+)\)/g,
      `](https://github.com/${owner}/${repo}/blob/main/$1)`
    )
    return marked.parse(adjustedContent) as string
  })().catch(() => "")

  readmeCache.set(cacheKey, promise)
  return promise
}

async function fetchRepositoriesFromGitHub(githubToken: string): Promise<Repository[]> {
  const headers = new Headers({
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "4ster-dev-site"
  })

  if (githubToken) headers.set("Authorization", `Bearer ${githubToken}`)

  const response = await fetch(
    "https://api.github.com/users/4ster-light/repos?per_page=100&sort=updated",
    {
      method: "GET",
      headers
    }
  )

  if (!response.ok) return []

  const data = (await response.json()) as RawRepository[]
  return data
    .filter((repo) => FEATURED_REPOS.includes(repo.name as (typeof FEATURED_REPOS)[number]))
    .sort(
      (a, b) =>
        FEATURED_REPOS.indexOf(a.name as (typeof FEATURED_REPOS)[number]) -
        FEATURED_REPOS.indexOf(b.name as (typeof FEATURED_REPOS)[number])
    )
    .map((repo) => ({
      name: repo.name,
      full_name: repo.full_name,
      url: repo.html_url,
      description: repo.description,
      stars: repo.stargazers_count,
      forks: repo.forks,
      language: repo.language,
      updated_at: new Date(repo.updated_at).toLocaleDateString()
    }))
}

export function fetchProjectReadme(
  owner: string,
  repo: string,
  githubToken: string
): Promise<string> {
  return fetchReadme(owner, repo, githubToken)
}

export function fetchProjects(githubToken: string): Promise<Repository[]> {
  const cacheKey = githubToken || "__no_token__"
  const cached = projectsCache.get(cacheKey)
  if (cached) return cached

  const promise = fetchRepositoriesFromGitHub(githubToken).catch(() => [])
  projectsCache.set(cacheKey, promise)
  return promise
}
