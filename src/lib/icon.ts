// Builds a CSS `mask-image` URL for an inline SVG. Astro inlines imported SVGs
// as data URIs containing single quotes, which breaks an unquoted `url()` in a
// style attribute, so the SVG is re-encoded and single-quoted explicitly.
export function svgMaskUrl(svg: string): string {
	const encoded = encodeURIComponent(svg)
		.replaceAll("'", "%27")
		.replaceAll("(", "%28")
		.replaceAll(")", "%29")
	return `url('data:image/svg+xml,${encoded}')`
}
