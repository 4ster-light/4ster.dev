export type OGType = "post" | "project" | "default"

const baseUrl = "https://4ster.dev"

export function ogImage(_title: string, _options?: { subtitle?: string; type?: OGType }): string {
  return `${baseUrl}/banner.png`
}

const site = {
  url: "/",
  baseUrl,
  banner: "/banner.png",
  substack: "https://4sterlight.substack.com",
  bio: "https://bio.4ster.dev",
  githubSponsors: "https://github.com/sponsors/4ster-light",
  projects: "/projects",
  donate: "/sponsor",
  uni: "https://esi.uclm.es"
}

export default site
