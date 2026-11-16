import { getCollection } from "astro:content"
import type { APIRoute, GetStaticPaths } from "astro"
import { buildRssFeed } from "../../lib/feed.ts"
import { publishedPosts, toFeedPost } from "../../lib/posts.ts"
import site, {
	combinedFeedPath,
	feedPath,
	LANGUAGES,
	type Lang,
	otherLanguage
} from "../../lib/site.ts"
import { xmlResponse } from "../../lib/xml.ts"

export const prerender = true

const FEED_COPY: Record<Lang, { title: string; description: string }> = {
	en: {
		title: "✰λster✰ (English)",
		description:
			"Programming, computer science, and open source by David Vivar Bogónez. English posts only."
	},
	es: {
		title: "✰λster✰ (Español)",
		description:
			"Programación, ciencias de la computación y código abierto por David Vivar Bogónez. Solo artículos en español."
	}
}

const COMBINED_TITLE = "✰λster✰ (all posts)"

export const getStaticPaths: GetStaticPaths = () =>
	LANGUAGES.map((lang) => ({ params: { lang } }))

export const GET: APIRoute = async ({ params }) => {
	const lang = (params.lang ?? "en") as Lang
	const alternateLang = otherLanguage(lang)
	const copy = FEED_COPY[lang]

	const posts = publishedPosts(await getCollection("posts"))
		.filter((post) => post.data.lang === lang)
		.map(toFeedPost)

	const body = buildRssFeed({
		posts,
		lang,
		siteUrl: site.baseUrl,
		selfHref: `${site.baseUrl}${feedPath(lang)}`,
		title: copy.title,
		description: copy.description,
		alternates: [
			{
				href: `${site.baseUrl}${feedPath(alternateLang)}`,
				title: FEED_COPY[alternateLang].title,
				lang: alternateLang
			},
			{
				href: `${site.baseUrl}${combinedFeedPath}`,
				title: COMBINED_TITLE
			}
		]
	})

	return xmlResponse(body)
}
