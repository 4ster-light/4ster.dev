import { env } from "cloudflare:workers"
import type { APIRoute } from "astro"
import {
	errorResponse,
	getVisitor,
	isValidSlug,
	jsonResponse,
	setVisitorCookie
} from "../../../../lib/engagement.ts"

export const prerender = false

interface CommentRow {
	id: number
	author: string
	body: string
	createdAt: string
}

const commentsQuery = `
	SELECT id, author, body,
		strftime('%Y-%m-%dT%H:%M:%fZ', created_at) AS createdAt
	FROM comments
	WHERE post_slug = ?
	ORDER BY created_at DESC, id DESC
	LIMIT 100
`

export const GET: APIRoute = async ({ params }) => {
	const slug = params.slug ?? ""
	if (!isValidSlug(slug)) return errorResponse("Invalid post slug", 400)

	const result = await env.DB.prepare(commentsQuery)
		.bind(slug)
		.all<CommentRow>()

	return jsonResponse({ comments: result.results })
}

export const POST: APIRoute = async ({ params, request }) => {
	const slug = params.slug ?? ""
	if (!isValidSlug(slug)) return errorResponse("Invalid post slug", 400)

	let input: { author?: unknown; body?: unknown; website?: unknown }
	try {
		const parsed: unknown = await request.json()
		if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
			return errorResponse("Invalid JSON body", 400)
		}
		input = parsed
	} catch {
		return errorResponse("Invalid JSON body", 400)
	}

	// This field is visually hidden and should remain empty for human readers.
	if (typeof input.website === "string" && input.website.length > 0) {
		return errorResponse("Comment could not be submitted", 400)
	}

	const author = typeof input.author === "string" ? input.author.trim() : ""
	const body = typeof input.body === "string" ? input.body.trim() : ""
	if (author.length < 1 || author.length > 40) {
		return errorResponse("Name must be between 1 and 40 characters", 400)
	}
	if (body.length < 1 || body.length > 1000) {
		return errorResponse("Comment must be between 1 and 1000 characters", 400)
	}

	const db = env.DB
	const visitor = await getVisitor(request)
	const recent = await db
		.prepare(
			"SELECT 1 FROM comments WHERE visitor_hash = ? AND created_at >= datetime('now', '-30 seconds') LIMIT 1"
		)
		.bind(visitor.hash)
		.first()
	if (recent) {
		return errorResponse("Please wait before posting another comment", 429)
	}

	await db
		.prepare(
			"INSERT INTO comments (post_slug, author, body, visitor_hash) VALUES (?, ?, ?, ?)"
		)
		.bind(slug, author, body, visitor.hash)
		.run()
	const result = await db.prepare(commentsQuery).bind(slug).all<CommentRow>()
	const headers = setVisitorCookie(new Headers(), request, visitor.token)
	return jsonResponse({ comments: result.results }, 201, headers)
}
