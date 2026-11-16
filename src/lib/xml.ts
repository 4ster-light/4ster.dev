/** Escapes the five XML entities that can appear in text content or attributes. */
export function escapeXml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;")
}

/** XML payloads (feeds and sitemaps) share one response shape. */
export function xmlResponse(body: string): Response {
	return new Response(body, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600"
		}
	})
}
