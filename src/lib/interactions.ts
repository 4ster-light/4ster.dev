export interface LikeState {
	likes: number
	liked: boolean
}

export interface Comment {
	id: number
	author: string
	body: string
	createdAt: string
}

export interface CommentInput {
	author?: unknown
	body?: unknown
	website?: unknown
}

export type CommentValidation =
	| { ok: true; author: string; body: string }
	| { ok: false; error: string }

export const COMMENT_LIMIT = 100
const COMMENT_COOLDOWN = "-30 seconds"

const commentsQuery = `
	SELECT id, author, body,
		strftime('%Y-%m-%dT%H:%M:%fZ', created_at) AS createdAt
	FROM comments
	WHERE post_slug = ?
	ORDER BY created_at DESC, id DESC
	LIMIT ${COMMENT_LIMIT}
`

export const validateCommentInput = (
	input: CommentInput
): CommentValidation => {
	// This field is visually hidden and should remain empty for human readers.
	if (typeof input.website === "string" && input.website.length > 0) {
		return { ok: false, error: "Comment could not be submitted" }
	}

	const author = typeof input.author === "string" ? input.author.trim() : ""
	const body = typeof input.body === "string" ? input.body.trim() : ""
	if (author.length < 1 || author.length > 40) {
		return { ok: false, error: "Name must be between 1 and 40 characters" }
	}
	if (body.length < 1 || body.length > 1000) {
		return { ok: false, error: "Comment must be between 1 and 1000 characters" }
	}

	return { ok: true, author, body }
}

export const getLikeState = async (
	db: D1Database,
	slug: string,
	visitorHash: string
): Promise<LikeState> => {
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

export const toggleLike = async (
	db: D1Database,
	slug: string,
	visitorHash: string
): Promise<LikeState> => {
	const inserted = await db
		.prepare(
			"INSERT OR IGNORE INTO likes (post_slug, visitor_hash) VALUES (?, ?)"
		)
		.bind(slug, visitorHash)
		.run()

	if (inserted.meta.changes === 0) {
		await db
			.prepare("DELETE FROM likes WHERE post_slug = ? AND visitor_hash = ?")
			.bind(slug, visitorHash)
			.run()
	}

	return getLikeState(db, slug, visitorHash)
}

export const listComments = async (
	db: D1Database,
	slug: string
): Promise<Comment[]> => {
	const result = await db.prepare(commentsQuery).bind(slug).all<Comment>()
	return result.results
}

export const hasRecentComment = async (
	db: D1Database,
	visitorHash: string
): Promise<boolean> => {
	const recent = await db
		.prepare(
			"SELECT 1 FROM comments WHERE visitor_hash = ? AND created_at >= datetime('now', ?) LIMIT 1"
		)
		.bind(visitorHash, COMMENT_COOLDOWN)
		.first()
	return Boolean(recent)
}

export const createComment = async (
	db: D1Database,
	slug: string,
	author: string,
	body: string,
	visitorHash: string
): Promise<Comment[]> => {
	await db
		.prepare(
			"INSERT INTO comments (post_slug, author, body, visitor_hash) VALUES (?, ?, ?, ?)"
		)
		.bind(slug, author, body, visitorHash)
		.run()
	return listComments(db, slug)
}
