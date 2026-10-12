import { getCollection } from "astro:content"
import site from "../lib/site.ts"

export const prerender = true

function escapeXml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;")
}

export async function GET() {
	const posts = (await getCollection("posts"))
		.filter((post) => !post.data["is-preview"])
		.sort(
			(a, b) =>
				new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf()
		)

	const items = posts.map((post) => {
		const lang = post.data.lang || "en"
		const url = `${site.baseUrl}/${lang}/posts/${post.slug}`
		const categories = (post.data.tags ?? [])
			.map((tag) => `      <category>${escapeXml(tag)}</category>`)
			.join("\n")

		return `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(post.data.description)}</description>
      <pubDate>${new Date(post.data.date).toUTCString()}</pubDate>
${categories}
    </item>`
	})

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>✰λster✰</title>
    <link>${site.baseUrl}</link>
    <atom:link href="${site.baseUrl}${site.rss}" rel="self" type="application/rss+xml" />
    <description>Programming, computer science, and open source by David Vivar Bogónez.</description>
    <language>en</language>
${items.join("\n")}
  </channel>
</rss>
`

	return new Response(body, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600"
		}
	})
}
