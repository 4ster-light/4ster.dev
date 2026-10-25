import { env } from "cloudflare:workers"
import { beforeEach, describe, expect, it } from "vitest"
import {
	COMMENT_LIMIT,
	createComment,
	getLikeState,
	hasRecentComment,
	listComments,
	toggleLike,
	validateCommentInput
} from "../../src/lib/interactions.ts"

const db = env.DB

beforeEach(async () => {
	await db.batch([
		db.prepare("DELETE FROM likes"),
		db.prepare("DELETE FROM comments")
	])
})

describe("likes", () => {
	it("toggles a visitor like and reports the current state", async () => {
		expect(await getLikeState(db, "post-a", "visitor-a")).toEqual({
			likes: 0,
			liked: false
		})
		expect(await toggleLike(db, "post-a", "visitor-a")).toEqual({
			likes: 1,
			liked: true
		})
		expect(await getLikeState(db, "post-a", "visitor-a")).toEqual({
			likes: 1,
			liked: true
		})
		expect(await toggleLike(db, "post-a", "visitor-a")).toEqual({
			likes: 0,
			liked: false
		})
	})

	it("counts different visitors once each and keeps posts separate", async () => {
		await toggleLike(db, "post-a", "visitor-a")
		await toggleLike(db, "post-a", "visitor-b")
		await toggleLike(db, "post-b", "visitor-a")

		expect(await getLikeState(db, "post-a", "visitor-a")).toEqual({
			likes: 2,
			liked: true
		})
		expect(await getLikeState(db, "post-b", "visitor-a")).toEqual({
			likes: 1,
			liked: true
		})
	})
})

describe("comment validation", () => {
	it("accepts and trims valid input", () => {
		expect(
			validateCommentInput({
				author: "  Ada  ",
				body: "  Hello there  ",
				website: ""
			})
		).toEqual({ ok: true, author: "Ada", body: "Hello there" })
	})

	it("rejects invalid names, bodies, and honeypot values", () => {
		expect(validateCommentInput({ author: "", body: "Hello" })).toMatchObject({
			ok: false
		})
		expect(
			validateCommentInput({ author: "Ada", body: "x".repeat(1001) })
		).toMatchObject({ ok: false })
		expect(
			validateCommentInput({
				author: "Ada",
				body: "Hello",
				website: "https://spam.example"
			})
		).toMatchObject({ ok: false })
	})
})

describe("comments", () => {
	it("returns newest comments first and separates posts", async () => {
		await createComment(db, "post-a", "Ada", "first", "visitor-a")
		await createComment(db, "post-a", "Grace", "second", "visitor-b")
		await createComment(db, "post-b", "Linus", "elsewhere", "visitor-c")

		expect(
			(await listComments(db, "post-a")).map((comment) => comment.body)
		).toEqual(["second", "first"])
		expect(
			(await listComments(db, "post-b")).map((comment) => comment.body)
		).toEqual(["elsewhere"])
	})

	it("caps the returned thread length", async () => {
		const statements = Array.from({ length: COMMENT_LIMIT + 5 }, (_, index) =>
			db
				.prepare(
					"INSERT INTO comments (post_slug, author, body, visitor_hash) VALUES (?, ?, ?, ?)"
				)
				.bind("post-a", "Ada", `comment-${index}`, `visitor-${index}`)
		)
		await db.batch(statements)

		const comments = await listComments(db, "post-a")
		expect(comments).toHaveLength(COMMENT_LIMIT)
		expect(comments[0]?.body).toBe(`comment-${COMMENT_LIMIT + 4}`)
	})

	it("rate-limits only the same visitor for the cooldown window", async () => {
		await createComment(db, "post-a", "Ada", "Hello", "visitor-a")

		expect(await hasRecentComment(db, "visitor-a")).toBe(true)
		expect(await hasRecentComment(db, "visitor-b")).toBe(false)

		await db
			.prepare(
				"UPDATE comments SET created_at = datetime('now', '-31 seconds') WHERE visitor_hash = ?"
			)
			.bind("visitor-a")
			.run()
		expect(await hasRecentComment(db, "visitor-a")).toBe(false)
	})
})
