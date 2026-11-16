import type { Lang } from "./site.ts"
import { escapeXml } from "./xml.ts"

export interface SitemapAlternate {
	lang: Lang | "x-default"
	href: string
}

export interface SitemapEntry {
	url: string
	lastmod?: string
	alternates?: SitemapAlternate[]
}

function renderUrl(entry: SitemapEntry): string {
	const lines = ["  <url>", `    <loc>${escapeXml(entry.url)}</loc>`]

	if (entry.lastmod) {
		lines.push(`    <lastmod>${escapeXml(entry.lastmod)}</lastmod>`)
	}
	for (const alternate of entry.alternates ?? []) {
		lines.push(
			`    <xhtml:link rel="alternate" hreflang="${alternate.lang}" href="${escapeXml(alternate.href)}" />`
		)
	}

	lines.push("  </url>")
	return lines.join("\n")
}

export function buildSitemap(entries: SitemapEntry[]): string {
	const urls = entries.map(renderUrl)

	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
		...urls,
		"</urlset>",
		""
	].join("\n")
}
