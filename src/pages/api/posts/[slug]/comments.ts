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
import {
	createComment,
	hasRecentComment,
	listComments,
	validateCommentInput
} from "../../../../lib/interactions.ts"

export const prerender = false

export const GET: APIRoute = async ({ params }) => {
	const slug = params.slug ?? ""
	if (!isValidSlug(slug)) return errorResponse("Invalid post slug", 400)

	return jsonResponse({ comments: await listComments(env.DB, slug) })
}

export const POST: APIRoute = async ({ params, request }) => {
	const slug = params.slug ?? ""
	if (!isValidSlug(slug)) return errorResponse("Invalid post slug", 400)
	if (!hasInteractionConsent(request)) {
		return errorResponse("Interaction cookie consent is required", 403)
	}

	let input: unknown
	try {
		input = await request.json()
	} catch {
		return errorResponse("Invalid JSON body", 400)
	}
	if (!input || typeof input !== "object" || Array.isArray(input)) {
		return errorResponse("Invalid JSON body", 400)
	}

	const validation = validateCommentInput(input)
	if (!validation.ok) {
		return errorResponse(validation.error, 400)
	}

	const visitor = await getVisitor(request)
	if (await hasRecentComment(env.DB, visitor.hash)) {
		return errorResponse("Please wait before posting another comment", 429)
	}

	const comments = await createComment(
		env.DB,
		slug,
		validation.author,
		validation.body,
		visitor.hash
	)
	const headers = setVisitorCookie(new Headers(), request, visitor.token)
	return jsonResponse({ comments }, 201, headers)
}
