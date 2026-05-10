import { getCollection } from "astro:content"
import { FEATURED_REPOS } from "../lib/projects.ts"
import site from "../lib/site.ts"

export const prerender = true

type SitemapEntry = {
  url: string
  lastmod?: string
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

function renderUrl(entry: SitemapEntry): string {
  const lastmod = entry.lastmod
    ? `
    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`
    : ""

  return `  <url>
    <loc>${escapeXml(entry.url)}</loc>${lastmod}
  </url>`
}

const posts = await getCollection("posts")

const urls: SitemapEntry[] = [
  { url: site.baseUrl },
  { url: `${site.baseUrl}/projects` },
  { url: `${site.baseUrl}/sponsor` }
]

for (const post of posts) {
  if (post.data["is-preview"]) continue

  const lang = post.data.lang || "en"
  urls.push({
    url: `${site.baseUrl}/${lang}/posts/${post.slug}`,
    lastmod: post.data.date.toISOString().slice(0, 10)
  })
}

for (const project of FEATURED_REPOS) {
  urls.push({
    url: `${site.baseUrl}/projects/${project}`
  })
}

export function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(renderUrl).join("\n")}
</urlset>
`

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  })
}
