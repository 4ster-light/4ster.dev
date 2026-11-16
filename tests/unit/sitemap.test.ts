import { describe, expect, it } from "vitest"
import { buildSitemap } from "../../src/lib/sitemap.ts"

const SITE = "https://example.test"

describe("buildSitemap", () => {
	it("renders locations, lastmod and xhtml alternates", () => {
		const xml = buildSitemap([
			{
				url: `${SITE}/en/posts/hello-world`,
				lastmod: "2026-01-02",
				alternates: [
					{ lang: "en", href: `${SITE}/en/posts/hello-world` },
					{ lang: "es", href: `${SITE}/es/posts/hola-mundo` },
					{ lang: "x-default", href: `${SITE}/en/posts/hello-world` }
				]
			}
		])

		expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"')
		expect(xml).toContain(`<loc>${SITE}/en/posts/hello-world</loc>`)
		expect(xml).toContain("<lastmod>2026-01-02</lastmod>")
		expect(xml).toContain(
			`<xhtml:link rel="alternate" hreflang="es" href="${SITE}/es/posts/hola-mundo" />`
		)
		expect(xml).toContain('hreflang="x-default"')
	})

	it("omits alternates and lastmod when absent", () => {
		const xml = buildSitemap([{ url: `${SITE}/projects` }])

		expect(xml).not.toContain("xhtml:link")
		expect(xml).not.toContain("<lastmod>")
		expect(xml).toContain(`<loc>${SITE}/projects</loc>`)
	})
})
