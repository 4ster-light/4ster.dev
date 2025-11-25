import { createMarkedInstance } from "$lib/utils/marked"

const marked = createMarkedInstance()

export type Repository = {
  name: string
  url: string
  description?: string
  stars: number
  forks: number
  language?: string
  updated_at: string
  readme?: string
}

type RawRepository = {
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
    .then((response) => response.json())
    .then(({ content }: { content: string }) => {
      const bytes = Uint8Array.from(atob(content.replace(/\s/g, "")), (c) => c.charCodeAt(0))
      const newContent = new TextDecoder().decode(bytes).replace(
        /\]\((?!https?:\/\/)([^)]+)\)/g,
        `](https://github.com/${owner}/${repo}/blob/main/$1)`
      )

      return marked.parse(newContent)
    }).catch((error) => {
      console.error(`Failed to fetch README for ${owner}/${repo}: ${error}`)
      return ""
    })
}

export default async function fetchRepositories(githubToken: string): Promise<Repository[]> {
  return await fetch("https://api.github.com/user/repos", {
    method: "GET",
    redirect: "follow",
    headers: new Headers({
      Authorization: `Bearer ${githubToken}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "4ster-dev-blog"
    })
  })
    .then((response) => response.json())
    .then(async (repositories: RawRepository[]) =>
      await Promise.all(
        repositories
          .filter((repo) => repo.name !== "4ster-light" && repo.stargazers_count > 0)
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .map(async (repo) => {
            const [owner, repoName] = repo.full_name.split("/")
            const readme = await fetchReadme(owner, repoName, githubToken)

            return {
              name: repo.name,
              url: repo.html_url,
              description: repo.description,
              stars: repo.stargazers_count,
              forks: repo.forks,
              language: repo.language,
              updated_at: new Date(repo.updated_at).toLocaleDateString(),
              readme
            }
          })
      )
    ).catch((error) => {
      throw new Error(`GitHub API repositories request failed: ${error}`)
    })
}
