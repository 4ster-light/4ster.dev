import type { OGType } from "@/routes/api/og.ts"

const baseUrl = "https://4ster.dev"

export function ogImage(
  title: string,
  options?: { subtitle?: string; type?: OGType }
): string {
  const params = new URLSearchParams({ title })
  if (options?.subtitle) params.set("subtitle", options.subtitle)
  if (options?.type) params.set("type", options.type)
  return `${baseUrl}/api/og?${params.toString()}`
}

export default {
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
