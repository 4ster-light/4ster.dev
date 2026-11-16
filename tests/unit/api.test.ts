import { env } from "cloudflare:workers"
import { beforeEach, describe, expect, it } from "vitest"
import {
	GET as getLikes,
	POST as postLike
} from "../../src/pages/api/likes/[key].ts"
import {
	GET as getComments,
	POST as postComment
} from "../../src/pages/api/posts/[slug]/comments.ts"

const db = env.DB

beforeEach(async () => {
	await db.batch([
		db.prepare("DELETE FROM likes"),
		db.prepare("DELETE FROM comments")
	])
})

const request = (path: string, method = "GET") =>
	new Request(`http://test${path}`, { method })

describe("interaction API consent", () => {
	it("rejects like reads and writes without consent", async () => {
		const getResponse = await getLikes({
			params: { key: "hello-world" },
			request: request("/api/likes/hello-world")
		} as never)
		const postResponse = await postLike({
			params: { key: "hello-world" },
			request: request("/api/likes/hello-world", "POST")
		} as never)

		expect(getResponse.status).toBe(403)
		expect(postResponse.status).toBe(403)
	})

	it("rejects an invalid like key before consent is checked", async () => {
		const response = await postLike({
			params: { key: "Not A Key" },
			request: request("/api/likes/Not%20A%20Key", "POST")
		} as never)

		expect(response.status).toBe(400)
	})

	it("rejects comment submission without consent", async () => {
		const response = await postComment({
			params: { slug: "post-a" },
			request: new Request("http://test/api/posts/post-a/comments", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ author: "Ada", body: "Hello" })
			})
		} as never)

		expect(response.status).toBe(403)
	})

	it("allows public comment reads without setting a cookie", async () => {
		const response = await getComments({
			params: { slug: "post-a" }
		} as never)

		expect(response.status).toBe(200)
		expect(await response.json()).toEqual({ comments: [] })
		expect(response.headers.get("Set-Cookie")).toBeNull()
	})

	it("creates a consented like and visitor cookie", async () => {
		const response = await postLike({
			params: { key: "hello-world" },
			request: new Request("http://test/api/likes/hello-world", {
				method: "POST",
				headers: { "X-Engagement-Consent": "accepted" }
			})
		} as never)

		expect(response.status).toBe(200)
		expect(await response.json()).toEqual({ likes: 1, liked: true })
		expect(response.headers.get("Set-Cookie")).toContain("aster_visitor=")
		expect(response.headers.get("Set-Cookie")).toContain("HttpOnly")
	})

	it("creates a consented comment and returns the thread", async () => {
		const response = await postComment({
			params: { slug: "post-a" },
			request: new Request("http://test/api/posts/post-a/comments", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Engagement-Consent": "accepted"
				},
				body: JSON.stringify({ author: "Ada", body: "Hello there" })
			})
		} as never)

		expect(response.status).toBe(201)
		expect(await response.json()).toEqual({
			comments: [
				expect.objectContaining({ author: "Ada", body: "Hello there" })
			]
		})
		expect(response.headers.get("Set-Cookie")).toContain("aster_visitor=")

		const readResponse = await getComments({
			params: { slug: "post-a" }
		} as never)
		expect(await readResponse.json()).toEqual({
			comments: [
				expect.objectContaining({ author: "Ada", body: "Hello there" })
			]
		})
	})
})
