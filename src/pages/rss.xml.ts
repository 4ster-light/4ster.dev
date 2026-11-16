import { getCollection } from "astro:content"
import type { APIRoute } from "astro"
import { buildRssFeed } from "../lib/feed.ts"
import { publishedPosts, toFeedPost } from "../lib/posts.ts"
import site, { combinedFeedPath, feedPath } from "../lib/site.ts"
import { xmlResponse } from "../lib/xml.ts"

export const prerender = true

const FEED_COPY = {
	en: { title: "✰λster✰ (English)" },
	es: { title: "✰λster✰ (Español)" }
} as const

/**
 * The aggregate feed. RSS 2.0 has no per-item language, so items carry
 * `dc:language` and the channel omits `<language>` rather than claiming one.
 */
export const GET: APIRoute = async () => {
	const posts = publishedPosts(await getCollection("posts")).map(toFeedPost)

	const body = buildRssFeed({
		posts,
		siteUrl: site.baseUrl,
		selfHref: `${site.baseUrl}${combinedFeedPath}`,
		title: "✰λster✰",
		description:
			"Programming, computer science, and open source by David Vivar Bogónez.",
		alternates: [
			{
				href: `${site.baseUrl}${feedPath("en")}`,
				title: FEED_COPY.en.title,
				lang: "en"
			},
			{
				href: `${site.baseUrl}${feedPath("es")}`,
				title: FEED_COPY.es.title,
				lang: "es"
			}
		]
	})

	return xmlResponse(body)
}
