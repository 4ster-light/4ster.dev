import { expect, type Page, test } from "@playwright/test"

const POST_PATH = "/en/posts/hello-world/"

interface MockComment {
	id: number
	author: string
	body: string
	createdAt: string
}

interface MockState {
	likes: number
	liked: boolean
	comments: MockComment[]
}

const mockInteractions = async (
	page: Page,
	initialComments: MockComment[] = []
) => {
	const state: MockState = {
		likes: 0,
		liked: false,
		comments: initialComments
	}
	const likeRequests: string[] = []

	await page.route("**/api/posts/hello-world/like", async (route) => {
		const method = route.request().method()
		likeRequests.push(method)

		if (method === "POST") {
			state.liked = !state.liked
			state.likes += state.liked ? 1 : -1
		}

		await route.fulfill({
			json: { likes: state.likes, liked: state.liked }
		})
	})

	await page.route("**/api/posts/hello-world/comments", async (route) => {
		if (route.request().method() === "POST") {
			const input = route.request().postDataJSON() as {
				author: string
				body: string
			}
			state.comments.unshift({
				id: state.comments.length + 1,
				author: input.author,
				body: input.body,
				createdAt: new Date().toISOString()
			})
			await route.fulfill({
				status: 201,
				json: { comments: state.comments }
			})
			return
		}

		await route.fulfill({ json: { comments: state.comments } })
	})

	return { state, likeRequests }
}

test("consent enables likes and comments and persists across reloads", async ({
	page
}) => {
	const { likeRequests } = await mockInteractions(page)
	await page.goto(POST_PATH)

	const banner = page.locator("[data-engagement-consent]")
	const likeButton = page.locator("[data-like-button]")
	const submit = page.locator("[data-comment-submit]")

	await expect(banner).toBeVisible()
	await expect(likeButton).toBeDisabled()
	await expect(submit).toBeDisabled()
	expect(likeRequests).toEqual([])

	await banner.getByRole("button", { name: "Accept", exact: true }).click()
	await expect(banner).toBeHidden()
	await expect(likeButton).toBeEnabled()
	await expect(submit).toBeEnabled()

	await likeButton.click()
	await expect(likeButton).toHaveAttribute("aria-pressed", "true")
	await expect(page.locator("[data-like-count]")).toHaveText("1")

	await page.locator('input[name="author"]').fill("Playwright reader")
	await page.locator('textarea[name="body"]').fill("A focused comment")
	await submit.click()
	await expect(page.locator("[data-comment-list]")).toContainText(
		"A focused comment"
	)
	await expect(page.locator("[data-comment-count]")).toHaveText("1")

	await page.reload()
	await expect(banner).toBeHidden()
	await expect(likeButton).toHaveAttribute("aria-pressed", "true")
	await expect(page.locator("[data-comment-list]")).toContainText(
		"A focused comment"
	)
})

test("denying consent keeps comments readable and interactions disabled", async ({
	page
}) => {
	const { likeRequests } = await mockInteractions(page, [
		{
			id: 1,
			author: "Existing reader",
			body: "An existing public comment",
			createdAt: new Date().toISOString()
		}
	])
	await page.goto(POST_PATH)

	const banner = page.locator("[data-engagement-consent]")
	await expect(page.locator("[data-comment-list]")).toContainText(
		"An existing public comment"
	)

	await banner.getByRole("button", { name: "Deny", exact: true }).click()
	await expect(banner).toBeHidden()
	await expect(page.locator("[data-like-button]")).toBeDisabled()
	await expect(page.locator('input[name="author"]')).toBeDisabled()
	await expect(page.locator('textarea[name="body"]')).toBeDisabled()
	await expect(page.locator("[data-comment-submit]")).toBeDisabled()
	await expect(page.locator("[data-comment-list]")).toContainText(
		"An existing public comment"
	)
	expect(likeRequests).toEqual([])
	expect(
		await page.evaluate(() => localStorage.getItem("aster-engagement-consent"))
	).toBe("denied")
	expect(
		(await page.context().cookies()).some(
			(cookie) => cookie.name === "aster_visitor"
		)
	).toBe(false)
})

test("renders comment text without interpreting embedded markup", async ({
	page
}) => {
	const payload =
		'<img src=x onerror="window.__commentXss = true"> Hello <b>world</b>'
	await mockInteractions(page, [
		{
			id: 1,
			author: "<b>Attacker</b>",
			body: payload,
			createdAt: new Date().toISOString()
		}
	])
	await page.goto(POST_PATH)

	const list = page.locator("[data-comment-list]")
	await expect(list).toContainText(payload)
	await expect(list.locator("img")).toHaveCount(0)
	await expect(list.locator("b")).toHaveCount(0)
	expect(
		await page.evaluate(
			() => (window as Window & { __commentXss?: boolean }).__commentXss
		)
	).toBeUndefined()
})
