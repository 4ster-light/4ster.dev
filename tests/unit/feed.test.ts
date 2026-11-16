import { describe, expect, it } from "vitest"
import { buildRssFeed, type FeedPost } from "../../src/lib/feed.ts"

const SITE = "https://example.test"

const post = (overrides: Partial<FeedPost> = {}): FeedPost => ({
	id: "hello-world",
	title: "Hello",
	description: "First & best",
	date: new Date("2026-01-02T00:00:00Z"),
	lang: "en",
	tags: ["intro"],
	...overrides
})

const build = (overrides: Partial<Parameters<typeof buildRssFeed>[0]> = {}) =>
	buildRssFeed({
		posts: [post()],
		siteUrl: SITE,
		selfHref: `${SITE}/rss.xml`,
		title: "All posts",
		description: "Everything",
		...overrides
	})

describe("buildRssFeed", () => {
	it("declares the channel language for a single language feed", () => {
		const xml = build({
			posts: [post({ lang: "es", id: "hola-mundo" })],
			lang: "es",
			selfHref: `${SITE}/es/rss.xml`
		})

		expect(xml).toContain("<language>es</language>")
		expect(xml).toContain(
			`<atom:link href="${SITE}/es/rss.xml" rel="self" type="application/rss+xml" />`
		)
	})

	it("leaves the combined channel unlabelled and tags every item", () => {
		const xml = build({
			posts: [post(), post({ id: "hola-mundo", lang: "es" })]
		})

		expect(xml).not.toContain("<language>")
		expect(xml).toContain("<dc:language>en</dc:language>")
		expect(xml).toContain("<dc:language>es</dc:language>")
	})

	it("orders items newest first", () => {
		const xml = build({
			posts: [
				post({ id: "older", date: new Date("2025-01-01T00:00:00Z") }),
				post({ id: "newer", date: new Date("2026-06-01T00:00:00Z") })
			]
		})

		expect(xml.indexOf("/en/posts/newer")).toBeLessThan(
			xml.indexOf("/en/posts/older")
		)
	})

	it("escapes text and emits categories", () => {
		const xml = build()

		expect(xml).toContain("First &amp; best")
		expect(xml).toContain("<category>intro</category>")
		expect(xml).toContain(`<link>${SITE}/en/posts/hello-world</link>`)
	})

	it("renders alternate feeds with their hreflang", () => {
		const xml = build({
			alternates: [
				{ href: `${SITE}/es/rss.xml`, title: "Español", lang: "es" },
				{ href: `${SITE}/rss.xml`, title: "All posts" }
			]
		})

		expect(xml).toContain(`href="${SITE}/es/rss.xml" rel="alternate"`)
		expect(xml).toContain('hreflang="es"')
	})
})
