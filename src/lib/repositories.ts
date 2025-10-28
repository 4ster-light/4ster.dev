import { config } from "dotenv"
import { join } from "node:path"
import process from "node:process"
import { createMarkedInstance } from "$lib/utils/marked"

config({ path: join(process.cwd(), ".env") })

const marked = createMarkedInstance()

const githubToken = process.env.GH_API
if (!githubToken) throw new Error("GH_API environment variable is not set.")

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

const fetchReadme = async (
  owner: string,
  repo: string,
  token: string
): Promise<string> =>
  await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
    method: "GET",
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json"
    })
  })
    .then((response) => response.json())
    .then((data) => {
      const bytes = Uint8Array.from(atob(data.content.replace(/\s/g, "")), (c) => c.charCodeAt(0))
      let content = new TextDecoder().decode(bytes)

      const repoUrl = `https://github.com/${owner}/${repo}`
      content = content.replace(
        /\]\((?!https?:\/\/)([^)]+)\)/g,
        `](${repoUrl}/blob/main/$1)`
      )

      return marked.parse(content)
    })
    .catch((error) => {
      console.warn(`Failed to fetch README for ${owner}/${repo}:`, error)
      return "No README available."
    })

export default await fetch("https://api.github.com/user/repos", {
  method: "GET",
  headers: new Headers({
    Authorization: `Bearer ${githubToken}`,
    Accept: "application/vnd.github.v3+json"
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
    throw new Error(`GitHub API request failed: ${error}`)
  }) as Repository[]
