import marked from "./marked.ts"

const FEATURED_REPOS = [
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

async function fetchReadme(owner: string, repo: string, token: string): Promise<string> {
  const headers = new Headers({
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "4ster-dev-site"
  })

  if (token) headers.set("Authorization", `Bearer ${token}`)

  return await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
    method: "GET",
    headers
  })
    .then((response) => (response.ok ? response.json() : Promise.reject(response.statusText)))
    .then(({ content }: { content: string }) => {
      const decodedContent = atob(content.replace(/\s/g, ""))
      const bytes = Uint8Array.from(decodedContent, (char) => char.charCodeAt(0))
      const utf8Content = new TextDecoder("utf-8").decode(bytes)
      const adjustedContent = utf8Content.replace(
        /\]\((?!https?:\/\/)([^)]+)\)/g,
        `](https://github.com/${owner}/${repo}/blob/main/$1)`
      )
      return marked.parse(adjustedContent) as string
    })
    .catch((_error) => "")
}

async function fetchRepositoriesFromGitHub(githubToken: string): Promise<Repository[]> {
  const headers = new Headers({
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "4ster-dev-site"
  })

  if (githubToken) headers.set("Authorization", `Bearer ${githubToken}`)

  return await fetch("https://api.github.com/users/4ster-light/repos?per_page=100&sort=updated", {
    method: "GET",
    headers
  })
    .then((response) => (response.ok ? response.json() : Promise.reject(response.statusText)))
    .then((data: RawRepository[]) =>
      Promise.all(
        data
          .filter((repo) => FEATURED_REPOS.includes(repo.name as (typeof FEATURED_REPOS)[number]))
          .sort(
            (a, b) =>
              FEATURED_REPOS.indexOf(a.name as (typeof FEATURED_REPOS)[number]) -
              FEATURED_REPOS.indexOf(b.name as (typeof FEATURED_REPOS)[number])
          )
          .map(async (repo) => {
            const [owner, repoName] = repo.full_name.split("/")
            return await fetchReadme(owner ?? "", repoName ?? "", githubToken).then((readme) => ({
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
}

export function fetchProjects(githubToken: string): Promise<Repository[]> {
  return fetchRepositoriesFromGitHub(githubToken)
}
