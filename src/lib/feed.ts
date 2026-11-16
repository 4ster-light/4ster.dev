import type { Lang } from "./site.ts"
import { escapeXml } from "./xml.ts"

export interface FeedPost {
	id: string
	title: string
	description: string
	date: Date
	lang: Lang
	tags?: string[]
}

export interface FeedAlternate {
	href: string
	title: string
	lang?: Lang
}

export interface FeedOptions {
	posts: FeedPost[]
	/** Undefined builds the combined feed, which carries per-item languages. */
	lang?: Lang
	siteUrl: string
	/** Absolute URL of this feed, used by `atom:link rel="self"`. */
	selfHref: string
	title: string
	description: string
	alternates?: FeedAlternate[]
}

const byDateDesc = (a: FeedPost, b: FeedPost) =>
	b.date.valueOf() - a.date.valueOf()

function renderItem(post: FeedPost, siteUrl: string): string {
	const url = `${siteUrl}/${post.lang}/posts/${post.id}`
	const categories = (post.tags ?? []).map(
		(tag) => `      <category>${escapeXml(tag)}</category>`
	)

	return [
		"    <item>",
		`      <title>${escapeXml(post.title)}</title>`,
		`      <link>${escapeXml(url)}</link>`,
		`      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
		`      <description>${escapeXml(post.description)}</description>`,
		`      <pubDate>${post.date.toUTCString()}</pubDate>`,
		`      <dc:language>${post.lang}</dc:language>`,
		...categories,
		"    </item>"
	].join("\n")
}

/**
 * Builds an RSS 2.0 feed. RSS 2.0 only defines a channel level `<language>`,
 * so every item also carries `<dc:language>` and the combined channel omits
 * the element instead of claiming one language.
 */
export function buildRssFeed({
	posts,
	lang,
	siteUrl,
	selfHref,
	title,
	description,
	alternates = []
}: FeedOptions): string {
	const items = [...posts]
		.sort(byDateDesc)
		.map((post) => renderItem(post, siteUrl))
	const alternateLinks = alternates.map((alternate) => {
		const hreflang = alternate.lang ? ` hreflang="${alternate.lang}"` : ""
		return `    <atom:link href="${escapeXml(alternate.href)}" rel="alternate" type="application/rss+xml" title="${escapeXml(alternate.title)}"${hreflang} />`
	})

	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">',
		"  <channel>",
		`    <title>${escapeXml(title)}</title>`,
		`    <link>${escapeXml(siteUrl)}</link>`,
		`    <atom:link href="${escapeXml(selfHref)}" rel="self" type="application/rss+xml" />`,
		`    <description>${escapeXml(description)}</description>`,
		...(lang ? [`    <language>${lang}</language>`] : []),
		...alternateLinks,
		...items,
		"  </channel>",
		"</rss>",
		""
	].join("\n")
}
