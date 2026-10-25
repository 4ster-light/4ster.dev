import { env } from "cloudflare:workers"
import type { APIRoute } from "astro"
import {
	errorResponse,
	getVisitor,
	hasInteractionConsent,
	isValidSlug,
	jsonResponse,
	setVisitorCookie
} from "../../../../lib/engagement.ts"

export const prerender = false

const getLikeState = async (
	db: D1Database,
	slug: string,
	visitorHash: string
) => {
	const [total, visitor] = await Promise.all([
		db
			.prepare("SELECT COUNT(*) AS count FROM likes WHERE post_slug = ?")
			.bind(slug)
			.first<{ count: number }>(),
		db
			.prepare(
				"SELECT 1 AS liked FROM likes WHERE post_slug = ? AND visitor_hash = ?"
			)
			.bind(slug, visitorHash)
			.first<{ liked: number }>()
	])

	return {
		likes: Number(total?.count ?? 0),
		liked: Boolean(visitor?.liked)
	}
}

export const GET: APIRoute = async ({ params, request }) => {
	const slug = params.slug ?? ""
	if (!isValidSlug(slug)) return errorResponse("Invalid post slug", 400)
	if (!hasInteractionConsent(request)) {
		return errorResponse("Interaction cookie consent is required", 403)
	}

	const visitor = await getVisitor(request)
	const headers = setVisitorCookie(new Headers(), request, visitor.token)
	const state = await getLikeState(env.DB, slug, visitor.hash)
	return jsonResponse(state, 200, headers)
}

export const POST: APIRoute = async ({ params, request }) => {
	const slug = params.slug ?? ""
	if (!isValidSlug(slug)) return errorResponse("Invalid post slug", 400)
	if (!hasInteractionConsent(request)) {
		return errorResponse("Interaction cookie consent is required", 403)
	}

	const db = env.DB
	const visitor = await getVisitor(request)
	const headers = setVisitorCookie(new Headers(), request, visitor.token)
	const existing = await db
		.prepare(
			"SELECT 1 AS liked FROM likes WHERE post_slug = ? AND visitor_hash = ?"
		)
		.bind(slug, visitor.hash)
		.first()

	if (existing) {
		await db
			.prepare("DELETE FROM likes WHERE post_slug = ? AND visitor_hash = ?")
			.bind(slug, visitor.hash)
			.run()
	} else {
		await db
			.prepare(
				"INSERT OR IGNORE INTO likes (post_slug, visitor_hash) VALUES (?, ?)"
			)
			.bind(slug, visitor.hash)
			.run()
	}

	return jsonResponse(await getLikeState(db, slug, visitor.hash), 200, headers)
}
