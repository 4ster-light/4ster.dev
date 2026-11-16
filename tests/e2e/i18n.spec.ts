import { expect, test } from "@playwright/test"

test("the legacy /blog URL lands on the English listing", async ({ page }) => {
	await page.goto("/blog/")

	await expect(page).toHaveURL(/\/en\/blog\/?$/)
	await expect(page.locator("html")).toHaveAttribute("lang", "en")
})

test("the Spanish listing is language addressed and advertises its feed", async ({
	page
}) => {
	await page.goto("/es/blog/")

	await expect(page.locator("html")).toHaveAttribute("lang", "es")
	await expect(
		page.locator(
			'link[rel="alternate"][type="application/rss+xml"][hreflang="es"]'
		)
	).toHaveAttribute("href", /\/es\/rss\.xml$/)
	await expect(
		page.getByRole("link", { name: "English posts" })
	).toHaveAttribute("href", "/en/blog")
})

test("a translated post switches to its sibling", async ({ page }) => {
	await page.goto("/es/posts/introduccion-a-los-interpretes/")

	await page.getByRole("link", { name: /Read in English/ }).click()

	await expect(page).toHaveURL(/\/en\/posts\/introduction-to-interpreters\/?$/)
	await expect(page.locator("html")).toHaveAttribute("lang", "en")
})

test("a Spanish post shares the like key of its English sibling", async ({
	page
}) => {
	await page.goto("/es/posts/etiquetas-inmutables-de-github/")

	await expect(page.locator("[data-post-interactions]")).toHaveAttribute(
		"data-like-key",
		"github-immutable-tags"
	)
})
