const VISITOR_COOKIE = "aster_visitor"
const VISITOR_PATTERN = /^[a-f0-9-]{36}$/

export const isValidSlug = (slug: string) =>
	/^[a-z0-9][a-z0-9-]{0,149}$/.test(slug)

export const jsonResponse = (
	body: unknown,
	status = 200,
	headers = new Headers()
) => {
	headers.set("Content-Type", "application/json; charset=utf-8")
	headers.set("Cache-Control", "no-store")
	return new Response(JSON.stringify(body), { status, headers })
}

export const getVisitor = async (request: Request) => {
	const cookies = request.headers.get("Cookie") ?? ""
	const cookie = cookies
		.split(";")
		.map((part) => part.trim())
		.find((part) => part.startsWith(`${VISITOR_COOKIE}=`))
	const existingToken = cookie?.slice(VISITOR_COOKIE.length + 1)
	const token =
		existingToken && VISITOR_PATTERN.test(existingToken)
			? existingToken
			: crypto.randomUUID()
	const digest = await crypto.subtle.digest(
		"SHA-256",
		new TextEncoder().encode(token)
	)
	const hash = Array.from(new Uint8Array(digest), (byte) =>
		byte.toString(16).padStart(2, "0")
	).join("")

	return { token, hash }
}

export const hasInteractionConsent = (request: Request) =>
	request.headers.get("X-Engagement-Consent") === "accepted"

export const setVisitorCookie = (
	headers: Headers,
	request: Request,
	token: string
) => {
	const secure = new URL(request.url).protocol === "https:" ? "; Secure" : ""
	headers.append(
		"Set-Cookie",
		`${VISITOR_COOKIE}=${token}; Max-Age=31536000; Path=/; HttpOnly; SameSite=Lax${secure}`
	)
	return headers
}

export const clearVisitorCookie = (request: Request) => {
	const secure = new URL(request.url).protocol === "https:" ? "; Secure" : ""
	const headers = new Headers()
	headers.append(
		"Set-Cookie",
		`${VISITOR_COOKIE}=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; HttpOnly; SameSite=Lax${secure}`
	)
	return headers
}

export const errorResponse = (message: string, status: number) =>
	jsonResponse({ error: message }, status)
