import marked, { preloadHighlightLanguages } from "./marked.ts"

export const FEATURED_REPOS = [
  "artscii",
  "sentinel",
  "http",
  "go-pane",
  "pmatrix",
  "bfcompiler",
  "perlin",
  "py-logic"
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

function githubHeaders(token: string): Headers {
  const headers = new Headers({
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "4ster-dev-site"
  })

  if (token) headers.set("Authorization", `Bearer ${token}`)
  return headers
}

async function fetchGitHub(url: string, token: string): Promise<Response> {
  const headers = githubHeaders(token)
  const response = await fetch(url, { method: "GET", headers })

  // A missing, expired or revoked token must never take the projects routes
  // down. Retry anonymously so a stale `GH_API` still returns data within the
  // lower unauthenticated rate limit.
  if (token && (response.status === 401 || response.status === 403)) {
    headers.delete("Authorization")
    return await fetch(url, { method: "GET", headers })
  }

  return response
}

function fetchReadme(owner: string, repo: string, token: string): Promise<string> {
  const cacheKey = `${token || "__no_token__"}:${owner}/${repo}`
  const cached = readmeCache.get(cacheKey)
  if (cached) return cached

  const promise = (async () => {
    const response = await fetchGitHub(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      token
    )

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
    await preloadHighlightLanguages(adjustedContent)
    return marked.parse(adjustedContent) as string
  })().catch(() => "")

  readmeCache.set(cacheKey, promise)
  return promise
}

async function fetchRepositoriesFromGitHub(githubToken: string): Promise<Repository[]> {
  const response = await fetchGitHub(
    "https://api.github.com/users/4ster-light/repos?per_page=100&sort=updated",
    githubToken
  )

  if (!response.ok) throw new Error(`GitHub API responded with ${response.status}`)

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

  const promise = fetchRepositoriesFromGitHub(githubToken).catch((error) => {
    // Do not cache failures, otherwise a transient GitHub error would keep the
    // projects routes empty for the lifetime of the process.
    projectsCache.delete(cacheKey)
    console.error(`Failed to fetch GitHub repositories: ${error}`)
    return []
  })
  projectsCache.set(cacheKey, promise)
  return promise
}
