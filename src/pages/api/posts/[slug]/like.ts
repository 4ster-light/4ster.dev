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
import { getLikeState, toggleLike } from "../../../../lib/interactions.ts"

export const prerender = false

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

	const visitor = await getVisitor(request)
	const headers = setVisitorCookie(new Headers(), request, visitor.token)
	const state = await toggleLike(env.DB, slug, visitor.hash)
	return jsonResponse(state, 200, headers)
}
