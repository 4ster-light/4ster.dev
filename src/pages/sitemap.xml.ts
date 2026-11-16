import { getCollection } from "astro:content"
import type { APIRoute } from "astro"
import { findTranslation, postLang, publishedPosts } from "../lib/posts.ts"
import { FEATURED_REPOS } from "../lib/projects.ts"
import site, { blogPath, LANGUAGES, postPath } from "../lib/site.ts"
import { buildSitemap, type SitemapEntry } from "../lib/sitemap.ts"
import { xmlResponse } from "../lib/xml.ts"

export const prerender = true

const posts = publishedPosts(await getCollection("posts"))

const listingAlternates = [
	...LANGUAGES.map((lang) => ({
		lang,
		href: `${site.baseUrl}${blogPath(lang)}`
	})),
	{ lang: "x-default" as const, href: `${site.baseUrl}${blogPath("en")}` }
]

const urls: SitemapEntry[] = [
	{ url: site.baseUrl },
	...LANGUAGES.map((lang) => ({
		url: `${site.baseUrl}${blogPath(lang)}`,
		alternates: listingAlternates
	})),
	{ url: `${site.baseUrl}/projects` },
	{ url: `${site.baseUrl}/sponsor` }
]

for (const post of posts) {
	const lang = postLang(post)
	const url = `${site.baseUrl}${postPath(lang, post.id)}`
	const translation = findTranslation(post, posts)

	// Only translated posts get alternates: a lone self alternate adds noise.
	const alternates = translation
		? [
				{ lang, href: url },
				{
					lang: translation.data.lang,
					href: `${site.baseUrl}${postPath(translation.data.lang, translation.id)}`
				},
				{
					lang: "x-default" as const,
					href: `${site.baseUrl}${postPath(
						"en",
						lang === "en" ? post.id : translation.id
					)}`
				}
			]
		: undefined

	urls.push({
		url,
		lastmod: post.data.date.toISOString().slice(0, 10),
		alternates
	})
}

for (const project of FEATURED_REPOS) {
	urls.push({ url: `${site.baseUrl}/projects/${project}` })
}

export const GET: APIRoute = () => xmlResponse(buildSitemap(urls))
