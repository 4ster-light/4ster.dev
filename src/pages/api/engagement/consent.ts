import type { APIRoute } from "astro"
import { clearVisitorCookie, jsonResponse } from "../../../lib/engagement.ts"

export const prerender = false

export const DELETE: APIRoute = async ({ request }) =>
	jsonResponse({ ok: true }, 200, clearVisitorCookie(request))
