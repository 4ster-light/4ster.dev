import { env } from "cloudflare:workers"
import type { APIRoute } from "astro"
import {
	errorResponse,
	getVisitor,
	hasInteractionConsent,
	isValidSlug,
	jsonResponse,
	setVisitorCookie
} from "../../../lib/engagement.ts"
import { getLikeState, toggleLike } from "../../../lib/interactions.ts"

export const prerender = false

/**
 * Likes are addressed by the shared interaction key rather than the post slug,
 * so both halves of a translation pair read and write the same counter.
 */
const readKey = (params: Record<string, string | undefined>): string | null => {
	const key = params.key ?? ""
	return isValidSlug(key) ? key : null
}

export const GET: APIRoute = async ({ params, request }) => {
	const key = readKey(params)
	if (!key) return errorResponse("Invalid like key", 400)
	if (!hasInteractionConsent(request)) {
		return errorResponse("Interaction cookie consent is required", 403)
	}

	const visitor = await getVisitor(request)
	const headers = setVisitorCookie(new Headers(), request, visitor.token)
	const state = await getLikeState(env.DB, key, visitor.hash)
	return jsonResponse(state, 200, headers)
}

export const POST: APIRoute = async ({ params, request }) => {
	const key = readKey(params)
	if (!key) return errorResponse("Invalid like key", 400)
	if (!hasInteractionConsent(request)) {
		return errorResponse("Interaction cookie consent is required", 403)
	}

	const visitor = await getVisitor(request)
	const headers = setVisitorCookie(new Headers(), request, visitor.token)
	const state = await toggleLike(env.DB, key, visitor.hash)
	return jsonResponse(state, 200, headers)
}
